import useDarkMode from "../../customHooks/useDarkmode";
import LinkButton from "./LinkButton";

function NotFound() {
  useDarkMode();

  return (
    <div className="text-center px-4">
      <h1 className="py-6 text-xl font-medium">404 Page Not found!</h1>
      <LinkButton name="Home" to="/home" />
    </div>
  );
}

export default NotFound;
