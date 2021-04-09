import React, { useCallback, useEffect, useState } from 'react';
import { ArcSlider, Box, Checkbox, Flex, Table, Txt } from 'rendition';
import styled from 'styled-components';
import { fetchDevice, fetchDevices } from '../api/lights.api';

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
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          items,
        }));
      }, 5000);
      // setState((prevState) => ({
      //   ...prevState,
      //   isLoading: false,
      //   items,
      // }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: 'Something was wrang',
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
          error: 'Something was wrang',
        }));
      }
    },
    [item]
  );

  /**
   * update device
   */
  const updateDevice = useCallback(({ id, ...props }) => {
    setState((prevState) => ({
      ...prevState,
      items: prevState.items.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            ...props,
          };
        }
        return i;
      }),
    }));
  }, []);
  /**
   * update device status
   */
  const handleChangeStatus = useCallback(
    async ({ id, active }) => {
      try {
        updateDevice({ id, active: !active });
      } catch (error) {
        updateDevice({ id, active });
      }
    },
    [updateDevice]
  );

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
            <ArcSlider width='450px' mx='auto'>
              <Txt color='white'>Brightness</Txt>
            </ArcSlider>
          ) : null}
        </ControlContainer>
      </Flex>
    </>
  );
});
