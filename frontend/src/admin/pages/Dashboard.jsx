import { useOutletContext } from "react-router-dom";

export default function Dashboard() {
  const { titulo } = useOutletContext();

  return (
    <div>
      <h1>{titulo}</h1>
    </div>
  );
}
