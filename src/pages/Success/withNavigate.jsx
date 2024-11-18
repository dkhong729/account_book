import { useNavigate } from 'react-router-dom';

export const withNavigate = (Component) => {
  return function (props) {
    const navigate = useNavigate(); // 使用 useNavigate 獲取 navigate 函數
    return <Component {...props} navigate={navigate} />; // 將 navigate 作為 prop 傳遞給 Component
  };
};
