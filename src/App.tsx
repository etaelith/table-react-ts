import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { SortBy, type User } from "./interfaces/interface";
import Table from "./components/Table";

function App() {
  const [state, setState] = useState<User[]>([]);
  const [showColor, setShowColor] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const originalUsers = useRef<User[]>([]);
  const handleColor = () => {
    setShowColor(!showColor);
  };
  const toggleSortCountry = () => {
    const newSorting = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSorting);
  };
  const handleDelete = (index: string) => {
    const filterUsers = state.filter((user) => user.login.uuid !== index);
    setState(filterUsers);
  };
  const handleReset = () => {
    setState(originalUsers.current);
  };
  const handleSort = (sort: SortBy) => {
    setSorting(sort)
  }
  const filteredCountry = useMemo(() => {
    console.log("filterCountry");
    return filterCountry !== null && filterCountry.length > 0
      ? state.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : state;
  }, [state, filterCountry]);

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredCountry

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }

    return filteredCountry.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredCountry, sorting]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}${100}`)
      .then(async (res) => await res.json())
      .then((res) => {
        setState(res.results);
        originalUsers.current = res.results;
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="container">
      <h1>Test Tech</h1>
      <div className="buttonContainer">
        <button onClick={handleColor}>ShowColor</button>
        <button onClick={toggleSortCountry}>{sorting === SortBy.NONE ? 'Order by Country' : 'Reset order'}</button>
        <button onClick={handleReset}>Restart</button>
        <input
          type="text"
          placeholder="filter by country"
          onChange={(e) => setFilterCountry(e.target.value)}
        ></input>
      </div>
      <Table
        users={sortedUsers}
        showColor={showColor}
        handleDelete={handleDelete}
        handleSort={handleSort}
      />
    </div>
  );
}

export default App;
