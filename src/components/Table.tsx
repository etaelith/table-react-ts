import { SortBy, type User } from "../interfaces/interface";
interface Props {
  users: User[];
  showColor: boolean;
  handleDelete: (index: string) => void;
  handleSort: (sort: SortBy) => void;
}
const Table = ({ users, showColor, handleDelete, handleSort }: Props) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>img</th>
            <th onClick={() => handleSort(SortBy.NAME)} style={{cursor:'pointer'}}>name</th>
            <th onClick={() => handleSort(SortBy.LAST)} style={{cursor:'pointer'}}>surname</th>
            <th onClick={() => handleSort(SortBy.COUNTRY)} style={{cursor:'pointer'}}>location</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const color = index % 2 === 0 ? "color" : "light";
            const show = showColor ? color : "";
            return (
              <tr key={user.login.uuid} className={show}>
                <td>
                  <img
                    src={user.picture.thumbnail}
                    alt={`picture of user ${user.name.first} ${user.name.last}`}
                  />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <button onClick={() => handleDelete(user.login.uuid)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Table;
