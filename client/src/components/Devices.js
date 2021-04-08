import React, { useCallback, useEffect, useState } from 'react';
import { ArcSlider, Box, Checkbox, Flex, Table, Txt } from 'rendition';
import styled from 'styled-components';
import { fetchDevices } from '../api/lights.api';

const ControlContainer = styled(Box)`
  border-top-left-radius: 10px;
`;

// TODO: Replace this with data loaded from the API
const SAMPLE_DATA = [
  {
    id: 1,
    name: 'Balcony',
    active: true,
    brightness: 50,
  },
  {
    id: 2,
    name: 'Bedroom 01',
    active: false,
    brightness: 70,
  },
  {
    id: 3,
    name: 'Bedroom 02',
    active: false,
    brightness: 70,
  },
];

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
    render(value) {
      return (
        <Flex>
          <Checkbox toggle checked={value} onChange={console.log} mr={2} />
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

export const Devices = React.memo(() => {
  const [{ isLoading }, setState] = useState({
    isLoading: true,
    items: [],
  });

  /**
   * methods
   */
  const loadDevices = useCallback(async () => {
    try {
      const { data: items } = await fetchDevices();
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        items,
      }));
    } catch (error) {}
  }, []);
  //component did mount
  useEffect(() => {
    loadDevices();
  }, [loadDevices]);
  return (
    <Flex flex='1' mt={4}>
      <Box flex='3' pl={3}>
        <Table flex='1' columns={columns} data={SAMPLE_DATA} rowKey='id' onRowClick={console.log} />
      </Box>

      <ControlContainer flex='2' ml={3} bg='secondary.main'>
        <ArcSlider width='450px' mx='auto'>
          <Txt color='white'>Brightness</Txt>
        </ArcSlider>
      </ControlContainer>
    </Flex>
  );
});
