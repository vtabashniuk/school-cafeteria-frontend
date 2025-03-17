import { useState } from "react";

const useUserFilter = () => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return { filter, handleFilterChange };
};

export default useUserFilter;
