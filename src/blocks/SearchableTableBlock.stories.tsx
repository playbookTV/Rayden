import type { Meta, StoryObj } from "@storybook/react";
import { SearchableTableBlock } from "./SearchableTableBlock";
import type { SearchableTableColumn, SearchableTableRow } from "./SearchableTableBlock";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Icon } from "../components/Icon";

const meta: Meta<typeof SearchableTableBlock> = {
  title: "Blocks/SearchableTable",
  component: SearchableTableBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchableTableBlock>;

/* ─── With Search (Variant 1) ─────────────────────────────────────── */
const searchColumns: SearchableTableColumn[] = [
  {
    key: "name",
    label: "Name",
    width: "280px",
    render: (_value, row) => (
      <div className="flex items-center gap-3">
        <Avatar
          type="image"
          src={row.avatar as string}
          size="sm"
        />
        <span className="text-sm font-medium text-grey-900">
          {row.name as string}
        </span>
      </div>
    ),
  },
  { key: "employeeId", label: "ID" },
  { key: "email", label: "Email" },
  {
    key: "category",
    label: "Category",
    render: (value) => (
      <Badge color="orange" type="accent" size="sm">
        {String(value)}
      </Badge>
    ),
  },
  { key: "reportTo", label: "Report to" },
];

const searchRows: SearchableTableRow[] = [
  { id: "1", name: "Olamide Akintan", avatar: "https://i.pravatar.cc/150?img=1", employeeId: "#28373", email: "olamideakintan@gmail.com", category: "Label", reportTo: "Roxanne Justina" },
  { id: "2", name: "Alison David", avatar: "https://i.pravatar.cc/150?img=2", employeeId: "#32876", email: "alisondavid@gmail.com", category: "Label", reportTo: "Victor Black" },
  { id: "3", name: "Megan Willow", avatar: "https://i.pravatar.cc/150?img=3", employeeId: "#11394", email: "meganwillow@gmail.com", category: "Label", reportTo: "Amaree Savil" },
  { id: "4", name: "Janelle Levi", avatar: "https://i.pravatar.cc/150?img=4", employeeId: "#99822", email: "janellelevi@gmail.com", category: "Label", reportTo: "Wilson Qillex" },
  { id: "5", name: "King Fisher", avatar: "https://i.pravatar.cc/150?img=5", employeeId: "#11873", email: "kingfisher@gmail.com", category: "Label", reportTo: "Roxanne Justina" },
  { id: "6", name: "Olivia Mahun", avatar: "https://i.pravatar.cc/150?img=6", employeeId: "#33644", email: "oliviamahun@gmail.com", category: "Label", reportTo: "Danielle Maxel" },
  { id: "7", name: "Vivian Kalu", avatar: "https://i.pravatar.cc/150?img=7", employeeId: "#00297", email: "viviankalu@gmail.com", category: "Label", reportTo: "Alexis Terence" },
  { id: "8", name: "Douglas Smith", avatar: "https://i.pravatar.cc/150?img=8", employeeId: "#00297", email: "douglassmith@gmail.com", category: "Label", reportTo: "Zahill Christian" },
  { id: "9", name: "Kenneth Tarry", avatar: "https://i.pravatar.cc/150?img=9", employeeId: "#00297", email: "kennethtarry@gmail.com", category: "Label", reportTo: "Roxanne Justina" },
];

export const WithSearch: Story = {
  render: () => (
    <div className="p-6">
      <SearchableTableBlock
        columns={searchColumns}
        rows={searchRows}
        selectable
        showFilter
        showDateSelector
        onRowAction={(id) => console.log("Action:", id)}
        page={1}
        totalPages={30}
        onPageChange={(p) => console.log("Page:", p)}
        onFilter={() => console.log("Filter")}
        onDateSelect={() => console.log("Date")}
        onSearch={(q) => console.log("Search:", q)}
      />
    </div>
  ),
};

/* ─── With Title (Variant 2) ──────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="star"
          size="xs"
          variant="solid"
          className={i < rating ? "text-warning-400" : "text-grey-200"}
        />
      ))}
    </div>
  );
}

const hospitalColumns: SearchableTableColumn[] = [
  { key: "name", label: "Name", sortable: true, width: "280px" },
  { key: "address", label: "Address", sortable: true },
  { key: "phone", label: "Phone no", sortable: true },
  {
    key: "rating",
    label: "Ratings",
    sortable: true,
    render: (value) => <StarRating rating={value as number} />,
  },
];

const hospitalRows: SearchableTableRow[] = [
  { id: "1", name: "Afrimed Specialist Hospital", address: "17, Bamidele Street, Osapa London, Lekki, Ib...", phone: "0814 609 2019", rating: 5 },
  { id: "2", name: "Aniyun Hospital Ltd", address: "3, Femi Aderibigbe Close, Ifako, Gbagada, La...", phone: "0814 609 2019", rating: 5 },
  { id: "3", name: "Araba Medical Centre", address: "122, Ekoro-Agbelekale Road, Big Joy B/stop,...", phone: "0814 609 2019", rating: 5 },
  { id: "4", name: "Blue Cross Hospital", address: "48, Ijaiye road, Ogba, (Beside UBA, Ikeja)", phone: "0814 609 2019", rating: 5 },
  { id: "5", name: "Crystal Specialist Hospital", address: "148/150, Akowonjo Road, Dopemu, Egbeda", phone: "0814 609 2019", rating: 5 },
  { id: "6", name: "Faith Care Hospital", address: "32 Road House 29, Festac Town, Lagos.", phone: "0814 609 2019", rating: 5 },
  { id: "7", name: "Faith City Hospital- Ajao estate", address: "16, Asa-Afariogun St., Off Osolo Way, Ajao Es...", phone: "0814 609 2019", rating: 5 },
  { id: "8", name: "Faleti Medical Centre", address: "98, Bale Street, New Road, b/stop, Olodi Apa...", phone: "0814 609 2019", rating: 5 },
  { id: "9", name: "First City Hospital", address: "1B, Williams Street, Off Diya street, Behind G...", phone: "0814 609 2019", rating: 5 },
  { id: "10", name: "First Dominican Hospital", address: "27, Aljahi Masha Road, By Masha B/stop, Sur...", phone: "0814 609 2019", rating: 5 },
  { id: "11", name: "General Hospital Lagos", address: "1, Broad Street, Lagos Island, Lagos.", phone: "0814 609 2019", rating: 5 },
];

export const WithTitle: Story = {
  render: () => (
    <div className="p-6">
      <SearchableTableBlock
        title="All Hospitals"
        columns={hospitalColumns}
        rows={hospitalRows}
        onRowAction={(id) => console.log("Action:", id)}
        onFilter={() => console.log("Filter")}
      />
    </div>
  ),
};
