type SpinnerProps = {
  dim?: string;
  color?: 'red' | 'green' | 'gray' | 'blue' | string;
  width?: string
};

const Spinner: React.FC<SpinnerProps> = ({ dim = '32px', color = 'black', ...props }) => {
  const colorMap: { [key: string]: string } = {
    red: '#d57748', // begeClaro
    green: '#51b85a', // verdeClaro
    gray: '#A7A7A7',
    blue: '#14A7D8', // azulCeu
    default: color, // fallback color
  };

  const strokeColor = colorMap[color] || colorMap.default;

  return (
    <div className="spinner-wrapper" style={{ width: dim, height: dim }}>
      <svg className="circle" viewBox="0 0 64 64">
        <circle className="path" cx="32" cy="32" r="25" fill="none" strokeWidth={props.width ?? "5"} style={{ stroke: strokeColor }} />
      </svg>
    </div>
  );
};

export default Spinner
