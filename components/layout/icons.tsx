import * as ReactIcons from "react-icons/hi";
export const Icons = ({ rows }) => {
  const IconsComponent = ReactIcons[rows];
  return (
    <div>
      <IconsComponent className="h-6 w-6 text-white" aria-hidden="true" />
    </div>
  );
};
