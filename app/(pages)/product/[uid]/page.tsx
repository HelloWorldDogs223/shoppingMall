'use client';

import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Rating,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ['tv', '3구 콘센트', '케이블', '스위치 케이스', '플러그'];

export default function Page() {
  const [age, setAge] = useState('선택');

  const [personName, setPersonName] = useState<string[]>([]);

  const handleChangeMultiple = (
    event: SelectChangeEvent<typeof personName>,
  ) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <div className="flex pt-[32px] h-screen">
      <img src="/example5.png" alt="product-image" />
      <div>
        <h1 className="text-[50px] font-bold mb-[10px]">닌텐도</h1>
        <h2 className="text-[30px] font-semibold mb-[16px]">
          [닌텐도 스위치] 게임 타이틀
        </h2>
        <Rating name="read-only" value={2} readOnly className="mb-[32px]" />
        <div className="flex justify-between">
          <div className="text-[30px] font-semibold mb-[100px]">가격</div>
          <div className="font-semibold text-[30px]">5000000000원</div>
        </div>

        <div className="w-[500px]">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">색상</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={10}>하얀색 (+5000)</MenuItem>
              <MenuItem value={20}>빨간색 (+3000)</MenuItem>
              <MenuItem value={30}>검은색 (+4000)</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="w-full mt-[120px]">
          <FormControl sx={{ m: 1, width: 500 }}>
            <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={personName}
              onChange={handleChangeMultiple}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={personName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
}
