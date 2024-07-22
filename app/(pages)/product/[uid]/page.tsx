import { Button } from '@mui/material';

export default function Page() {
  return (
    <div className="flex">
      <img src="/example5.png" alt="product-image" />
      <div>
        <div>닌텐도</div>
        <div>[닌텐도 스위치] 게임 타이틀</div>
        <div>별점</div>
        <div>가격</div>
        <div>타이틀 선택</div>
        <select name="languages" id="lang">
          <option value="javascript">JavaScript</option>
          <option value="php">PHP</option>
          <option value="java">Java</option>
          <option value="golang">Golang</option>
          <option value="python">Python</option>
          <option value="c#">C#</option>
          <option value="C++">C++</option>
          <option value="erlang">Erlang</option>
        </select>
      </div>
      <Button className="w-[100px] h-[100px]" variant="contained">
        하이
      </Button>
    </div>
  );
}
