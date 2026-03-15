import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as S}from"./iframe-g5PiM8Jh.js";import{T as j,a as g,b as i,c as n,d as C,e as t}from"./Table-B4wtbzbd.js";import{B as y}from"./Badge-_vRqbRhl.js";import{A as B}from"./Avatar-BvmkuJdv.js";import{C as R}from"./Checkbox-DNEEjnbh.js";import{I as V}from"./Icon-CxPrjGB-.js";import"./preload-helper-PPVm8Dsz.js";import"./cn-C8nBGPD0.js";import"./resolveIcon-B4eesLNI.js";const G={title:"Components/Table",component:j,tags:["autodocs"]},u=[{id:"1",name:"John Doe",email:"john@example.com",role:"Admin",status:"Active"},{id:"2",name:"Jane Smith",email:"jane@example.com",role:"Editor",status:"Active"},{id:"3",name:"Bob Wilson",email:"bob@example.com",role:"Viewer",status:"Inactive"},{id:"4",name:"Alice Brown",email:"alice@example.com",role:"Editor",status:"Active"},{id:"5",name:"Charlie Lee",email:"charlie@example.com",role:"Viewer",status:"Inactive"}],N={render:()=>e.jsx("div",{className:"p-6",children:e.jsxs(j,{children:[e.jsx(g,{children:e.jsxs(i,{children:[e.jsx(n,{children:"Name"}),e.jsx(n,{children:"Email"}),e.jsx(n,{children:"Role"}),e.jsx(n,{children:"Status"})]})}),e.jsx(C,{children:u.map(a=>e.jsxs(i,{children:[e.jsx(t,{className:"font-medium",children:a.name}),e.jsx(t,{className:"text-grey-600",children:a.email}),e.jsx(t,{children:a.role}),e.jsx(t,{children:e.jsx(y,{color:a.status==="Active"?"success":"neutral",type:"accent",size:"sm",children:a.status})})]},a.id))})]})})},v={render:()=>{const a=()=>{const[r,x]=S.useState(new Set),o=r.size===u.length,T=r.size>0&&!o,c=()=>{x(o?new Set:new Set(u.map(l=>l.id)))},p=l=>{x(d=>{const m=new Set(d);return m.has(l)?m.delete(l):m.add(l),m})};return e.jsx("div",{className:"p-6",children:e.jsxs(j,{children:[e.jsx(g,{children:e.jsxs(i,{selected:o||T,children:[e.jsx(n,{className:"w-12",children:e.jsx(R,{checked:o,onChange:c,ref:l=>{l&&(l.indeterminate=T)}})}),e.jsx(n,{children:"Name"}),e.jsx(n,{children:"Email"}),e.jsx(n,{children:"Role"}),e.jsx(n,{children:"Status"})]})}),e.jsx(C,{children:u.map(l=>e.jsxs(i,{selected:r.has(l.id),children:[e.jsx(t,{className:"w-12",children:e.jsx(R,{checked:r.has(l.id),onChange:()=>p(l.id)})}),e.jsx(t,{className:"font-medium",children:l.name}),e.jsx(t,{className:"text-grey-600",children:l.email}),e.jsx(t,{children:l.role}),e.jsx(t,{children:e.jsx(y,{color:l.status==="Active"?"success":"neutral",type:"accent",size:"sm",children:l.status})})]},l.id))})]})})};return e.jsx(a,{})}},w={render:()=>{const a=()=>{const[r,x]=S.useState(null),[o,T]=S.useState(null),c=l=>{r===l?(T(d=>d==="asc"?"desc":d==="desc"?null:"asc"),o==="desc"&&x(null)):(x(l),T("asc"))},p=[...u].sort((l,d)=>{if(!r||!o)return 0;const m=l[r],f=d[r];return o==="asc"?m.localeCompare(f):f.localeCompare(m)});return e.jsx("div",{className:"p-6",children:e.jsxs(j,{children:[e.jsx(g,{children:e.jsxs(i,{children:[e.jsx(n,{sortable:!0,sortDirection:r==="name"?o:null,onSort:()=>c("name"),children:"Name"}),e.jsx(n,{sortable:!0,sortDirection:r==="email"?o:null,onSort:()=>c("email"),children:"Email"}),e.jsx(n,{sortable:!0,sortDirection:r==="role"?o:null,onSort:()=>c("role"),children:"Role"}),e.jsx(n,{children:"Status"})]})}),e.jsx(C,{children:p.map(l=>e.jsxs(i,{children:[e.jsx(t,{className:"font-medium",children:l.name}),e.jsx(t,{className:"text-grey-600",children:l.email}),e.jsx(t,{children:l.role}),e.jsx(t,{children:e.jsx(y,{color:l.status==="Active"?"success":"neutral",type:"accent",size:"sm",children:l.status})})]},l.id))})]})})};return e.jsx(a,{})}},H={render:()=>e.jsx("div",{className:"p-6",children:e.jsxs(j,{children:[e.jsx(g,{children:e.jsxs(i,{children:[e.jsx(n,{children:"Member"}),e.jsx(n,{children:"Role"}),e.jsx(n,{children:"Status"}),e.jsx(n,{children:"Actions"})]})}),e.jsx(C,{children:u.map(a=>e.jsxs(i,{children:[e.jsx(t,{children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(B,{type:"initials",initials:a.name.split(" ").map(r=>r[0]).join(""),size:"md"}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-body-sm font-medium text-grey-900",children:a.name}),e.jsx("span",{className:"text-body-sm text-grey-600",children:a.email})]})]})}),e.jsx(t,{children:a.role}),e.jsx(t,{children:e.jsx(y,{color:a.status==="Active"?"success":"neutral",type:"accent",size:"sm",children:a.status})}),e.jsx(t,{children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{type:"button",className:"text-body-sm font-semibold text-primary-400",children:"Edit"}),e.jsx("button",{type:"button",className:"text-body-sm font-semibold text-grey-400",children:"Delete"})]})})]},a.id))})]})})},D={render:()=>{const a=()=>{const[r,x]=S.useState(new Set),[o,T]=S.useState("name"),[c,p]=S.useState("asc"),l=r.size===u.length,d=r.size>0&&!l,m=()=>{x(l?new Set:new Set(u.map(s=>s.id)))},f=s=>{x(h=>{const b=new Set(h);return b.has(s)?b.delete(s):b.add(s),b})},A=s=>{o===s?p(h=>h==="asc"?"desc":"asc"):(T(s),p("asc"))},k=[...u].sort((s,h)=>{if(!o||!c)return 0;const b=s[o],z=h[o];return c==="asc"?b.localeCompare(z):z.localeCompare(b)});return e.jsx("div",{className:"rounded-xl border border-grey-200 p-6",children:e.jsxs(j,{children:[e.jsx(g,{children:e.jsxs(i,{selected:l||d,children:[e.jsx(n,{className:"w-12",children:e.jsx(R,{checked:l,onChange:m,ref:s=>{s&&(s.indeterminate=d)}})}),e.jsx(n,{sortable:!0,sortDirection:o==="name"?c:null,onSort:()=>A("name"),children:"Member"}),e.jsx(n,{sortable:!0,sortDirection:o==="role"?c:null,onSort:()=>A("role"),children:"Role"}),e.jsx(n,{children:"Status"}),e.jsx(n,{className:"w-20"})]})}),e.jsx(C,{children:k.map(s=>{const h=r.has(s.id);return e.jsxs(i,{selected:h,children:[e.jsx(t,{className:"w-12",children:e.jsx(R,{checked:h,onChange:()=>f(s.id)})}),e.jsx(t,{children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(B,{type:"initials",initials:s.name.split(" ").map(b=>b[0]).join(""),size:"md",status:"online"}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-body-sm font-medium text-grey-900",children:s.name}),e.jsx("span",{className:"text-body-sm text-grey-600",children:s.email})]})]})}),e.jsx(t,{children:s.role}),e.jsx(t,{children:e.jsx(y,{color:s.status==="Active"?"success":"neutral",type:"accent",size:"sm",children:s.status})}),e.jsx(t,{children:e.jsx("button",{type:"button",className:"flex size-8 items-center justify-center rounded-lg border border-grey-200 bg-white text-grey-500 hover:bg-grey-50",children:e.jsx(V,{name:"more-vertical",size:"sm"})})})]},s.id)})})]})})};return e.jsx(a,{})}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-grey-600">{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge color={user.status === "Active" ? "success" : "neutral"} type="accent" size="sm">
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>
}`,...N.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const SelectionDemo = () => {
      const [selected, setSelected] = useState<Set<string>>(new Set());
      const allSelected = selected.size === users.length;
      const someSelected = selected.size > 0 && !allSelected;
      const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(users.map(u => u.id)));
      };
      const toggleRow = (id: string) => {
        setSelected(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);else next.add(id);
          return next;
        });
      };
      return <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow selected={allSelected || someSelected}>
                <TableHead className="w-12">
                  <Checkbox checked={allSelected} onChange={toggleAll} ref={el => {
                  if (el) el.indeterminate = someSelected;
                }} />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => <TableRow key={user.id} selected={selected.has(user.id)}>
                  <TableCell className="w-12">
                    <Checkbox checked={selected.has(user.id)} onChange={() => toggleRow(user.id)} />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-grey-600">{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge color={user.status === "Active" ? "success" : "neutral"} type="accent" size="sm">
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>;
    };
    return <SelectionDemo />;
  }
}`,...v.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const SortDemo = () => {
      const [sortCol, setSortCol] = useState<string | null>(null);
      const [sortDir, setSortDir] = useState<SortDirection>(null);
      const handleSort = (col: string) => {
        if (sortCol === col) {
          setSortDir(d => d === "asc" ? "desc" : d === "desc" ? null : "asc");
          if (sortDir === "desc") setSortCol(null);
        } else {
          setSortCol(col);
          setSortDir("asc");
        }
      };
      const sorted = [...users].sort((a, b) => {
        if (!sortCol || !sortDir) return 0;
        const aVal = a[sortCol as keyof typeof a];
        const bVal = b[sortCol as keyof typeof b];
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
      return <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead sortable sortDirection={sortCol === "name" ? sortDir : null} onSort={() => handleSort("name")}>
                  Name
                </TableHead>
                <TableHead sortable sortDirection={sortCol === "email" ? sortDir : null} onSort={() => handleSort("email")}>
                  Email
                </TableHead>
                <TableHead sortable sortDirection={sortCol === "role" ? sortDir : null} onSort={() => handleSort("role")}>
                  Role
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map(user => <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-grey-600">{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge color={user.status === "Active" ? "success" : "neutral"} type="accent" size="sm">
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>;
    };
    return <SortDemo />;
  }
}`,...w.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar type="initials" initials={user.name.split(" ").map(n => n[0]).join("")} size="md" />
                  <div className="flex flex-col">
                    <span className="text-body-sm font-medium text-grey-900">
                      {user.name}
                    </span>
                    <span className="text-body-sm text-grey-600">
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge color={user.status === "Active" ? "success" : "neutral"} type="accent" size="sm">
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <button type="button" className="text-body-sm font-semibold text-primary-400">
                    Edit
                  </button>
                  <button type="button" className="text-body-sm font-semibold text-grey-400">
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>
}`,...H.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => {
    const FullDemo = () => {
      const [selected, setSelected] = useState<Set<string>>(new Set());
      const [sortCol, setSortCol] = useState<string | null>("name");
      const [sortDir, setSortDir] = useState<SortDirection>("asc");
      const allSelected = selected.size === users.length;
      const someSelected = selected.size > 0 && !allSelected;
      const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(users.map(u => u.id)));
      };
      const toggleRow = (id: string) => {
        setSelected(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);else next.add(id);
          return next;
        });
      };
      const handleSort = (col: string) => {
        if (sortCol === col) {
          setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
          setSortCol(col);
          setSortDir("asc");
        }
      };
      const sorted = [...users].sort((a, b) => {
        if (!sortCol || !sortDir) return 0;
        const aVal = a[sortCol as keyof typeof a];
        const bVal = b[sortCol as keyof typeof b];
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
      return <div className="rounded-xl border border-grey-200 p-6">
          <Table>
            <TableHeader>
              <TableRow selected={allSelected || someSelected}>
                <TableHead className="w-12">
                  <Checkbox checked={allSelected} onChange={toggleAll} ref={el => {
                  if (el) el.indeterminate = someSelected;
                }} />
                </TableHead>
                <TableHead sortable sortDirection={sortCol === "name" ? sortDir : null} onSort={() => handleSort("name")}>
                  Member
                </TableHead>
                <TableHead sortable sortDirection={sortCol === "role" ? sortDir : null} onSort={() => handleSort("role")}>
                  Role
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map(user => {
              const isSelected = selected.has(user.id);
              return <TableRow key={user.id} selected={isSelected}>
                    <TableCell className="w-12">
                      <Checkbox checked={isSelected} onChange={() => toggleRow(user.id)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar type="initials" initials={user.name.split(" ").map(n => n[0]).join("")} size="md" status="online" />
                        <div className="flex flex-col">
                          <span className="text-body-sm font-medium text-grey-900">
                            {user.name}
                          </span>
                          <span className="text-body-sm text-grey-600">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge color={user.status === "Active" ? "success" : "neutral"} type="accent" size="sm">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button type="button" className="flex size-8 items-center justify-center rounded-lg border border-grey-200 bg-white text-grey-500 hover:bg-grey-50">
                        <Icon name="more-vertical" size="sm" />
                      </button>
                    </TableCell>
                  </TableRow>;
            })}
            </TableBody>
          </Table>
        </div>;
    };
    return <FullDemo />;
  }
}`,...D.parameters?.docs?.source}}};const K=["Default","WithSelection","WithSorting","WithLeadingAvatar","FullFeatured"];export{N as Default,D as FullFeatured,H as WithLeadingAvatar,v as WithSelection,w as WithSorting,K as __namedExportsOrder,G as default};
