import { useContext, useEffect, useRef, useState } from "react";
import { DashboardContext } from "../../contexts/DashboardContext";
import { Button, Input, InputRef, Space, Table, TableColumnType, TableColumnsType } from "antd";
import { useNavigate } from "react-router-dom";
import { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { User } from "../../types/types";

export function AllUsers() {
  const dashboardContext = useContext(DashboardContext);
  if (!dashboardContext) return;
  const { users, getUsers } = dashboardContext;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const navigate = useNavigate();

  type DataIndex = keyof User;

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void, confirm: FilterDropdownProps["confirm"]) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<User> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<User> = [
    {
      title: "Id",
      dataIndex: "id",
      width: "10%",
      ...getColumnSearchProps("id"),
      responsive: ["sm"],
    },
    {
      title: "Prénom",
      dataIndex: "firstname",
      width: "20%",
      ...getColumnSearchProps("firstname"),
    },
    {
      title: "Nom",
      dataIndex: "lastname",
      width: "20%",
      ...getColumnSearchProps("lastname"),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
      ...getColumnSearchProps("email"),
      responsive: ["sm"],
    },
    {
      title: "Magasin",
      dataIndex: "shop",
      width: "20%",
      ...getColumnSearchProps("shop"),
      responsive: ["sm"],
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "10%",
      ...getColumnSearchProps("role"),
      responsive: ["sm"],
    },
  ];

  return (
    <Table
      onRow={(item) => {
        return {
          onClick: () => navigate(`/dashboard/user/${item.id}`),
        };
      }}
      columns={columns}
      rowKey={"id"}
      dataSource={users ? users : []}
    />
  );
}
