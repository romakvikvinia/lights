import React, { useCallback, useEffect, useState } from 'react';
import { ArcSlider, Box, Checkbox, Flex, Table, Txt, Input } from 'rendition';
import styled from 'styled-components';
import { fetchDevice, fetchDevices, fetchUpdateDevice } from '../api/lights.api';

import { Messages } from './simple/Messages';

const ControlContainer = styled(Box)`
  border-top-left-radius: 10px;
`;

export const Devices = React.memo(() => {
  const [{ isLoading, items, isItemLoading, item, error }, setState] = useState({
    isLoading: true,
    items: [],
    error: null,

    // item properties
    isItemLoading: false,
    item: null,
  });

  /**
   * methods
   */

  /**
   * load data from api
   */
  const loadDevices = useCallback(async () => {
    try {
      const { data: items } = await fetchDevices();
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        items,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: 'Something was wrong',
      }));
    }
  }, []);

  /**
   * get device
   */
  const handleRowClick = useCallback(
    async ({ id }) => {
      if (item && id === item.id) return;
      try {
        setState((prevState) => ({
          ...prevState,
          isItemLoading: true,
        }));
        const { data: item } = await fetchDevice(id);
        setState((prevState) => ({
          ...prevState,
          isItemLoading: false,
          item,
        }));
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          isItemLoading: false,
          error: 'Something was wrong',
        }));
      }
    },
    [item]
  );

  /**
   * update device and item(current device) if it exists
   */
  const updateDevice = useCallback(({ id, ...props }) => {
    setState((prevState) => {
      let { item } = prevState;
      if (item && item.id === id) {
        item = {
          ...item,
          ...props,
        };
      }
      return {
        ...prevState,
        item,
        items: prevState.items.map((i) => {
          if (i.id === id) {
            return {
              ...i,
              ...props,
            };
          }
          return i;
        }),
      };
    });
  }, []);
  /**
   * update device status
   */
  const handleChangeStatus = useCallback(async ({ id, active }) => {
    try {
      let payload = { id, active: !active };
      updateDevice(payload);
      await fetchUpdateDevice(payload);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: 'Something was wrong, can not update device status',
      }));
      updateDevice({ id, active });
    }
  }, []);

  const handleChangeBrightness = useCallback(async (brightness) => {
    try {
      setState((prevState) => {
        let { item } = prevState;
        item.brightness = parseInt(brightness * 100);
        return {
          ...prevState,
          item,
          items: prevState.items.map((i) => {
            if (i.id === item.id) {
              return item;
            }
            return i;
          }),
        };
      });
    } catch (error) {}
  }, []);
  /**
   * api update device, save Brightness
   */
  const handleSaveBrightness = useCallback(async () => {
    try {
      await fetchUpdateDevice(item);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: 'Something was wrong, can not update device Brightness',
      }));
    }
  }, [item]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      item: {
        ...prevState.item,
        [name]: value,
      },
    }));
  }, []);

  const handleSaveName = useCallback(async () => {
    try {
      if (!item.name) return;
      await fetchUpdateDevice(item);
      updateDevice(item);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: 'Something was wrong, can not update device Name',
      }));
    }
  }, [item]);

  //component did mount
  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  /**
   * data transform
   */

  const columns = [
    {
      field: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      field: 'active',
      label: 'State',
      sortable: true,
      render(value, row) {
        return (
          <Flex>
            <Checkbox toggle checked={value} onChange={() => handleChangeStatus(row)} mr={2} />
            <Txt ml={2}>{value ? 'On' : 'Off'}</Txt>
          </Flex>
        );
      },
    },
    {
      field: 'brightness',
      label: 'Brightness',
      sortable: true,
      render(value) {
        return `${value}%`;
      },
    },
  ];

  return (
    <>
      <Messages danger message={error} />

      <Flex flex='1' mt={1}>
        <Box flex='3' pl={3}>
          {isLoading ? (
            'Loading....'
          ) : (
            <Table flex='1' columns={columns} data={items} rowKey='id' onRowClick={handleRowClick} />
          )}
        </Box>
        {}
        <ControlContainer flex='2' ml={3} bg='secondary.main'>
          {isItemLoading ? (
            'Loading...'
          ) : item ? (
            <>
              <Box p={2} mt={3}>
                <Input
                  name='name'
                  backgroundColor='white'
                  value={item.name}
                  onChange={handleChange}
                  onBlur={handleSaveName}
                />
              </Box>
              <ArcSlider
                width='450px'
                mx='auto'
                onValueChange={handleChangeBrightness}
                value={item.brightness / 100}
                onMouseUp={handleSaveBrightness}
              >
                <Txt color='white'>Brightness</Txt>
              </ArcSlider>
            </>
          ) : null}
        </ControlContainer>
      </Flex>
    </>
  );
});
