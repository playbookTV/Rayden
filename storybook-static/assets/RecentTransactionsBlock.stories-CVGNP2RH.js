import{j as e}from"./jsx-runtime-u17CrQMm.js";import{c as o}from"./cn-C8nBGPD0.js";import{I as c}from"./Icon-CxPrjGB-.js";import"./iframe-g5PiM8Jh.js";import"./preload-helper-PPVm8Dsz.js";function s({title:t="Recent Transactions",seeAllLabel:l="See all",onSeeAll:i,transactions:d,onTransactionClick:m,className:u}){return e.jsxs("div",{className:o("flex flex-col gap-3",u),children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"text-lg font-semibold text-grey-900",children:t}),i&&e.jsxs("button",{type:"button",onClick:i,className:"flex items-center gap-1.5 text-xs font-semibold text-primary-500",children:[l,e.jsx(c,{name:"chevron-right",size:"xs"})]})]}),e.jsx("div",{className:"bg-white border border-grey-100 rounded-[10px] px-5 py-6",children:e.jsx("div",{className:"flex flex-col gap-5",children:d.map(n=>{const a=n.direction==="outgoing";return e.jsxs("button",{type:"button",onClick:()=>m?.(n.id),className:"flex items-center gap-3 group text-left",children:[e.jsx("div",{className:o("flex items-center justify-center size-10 rounded-full shrink-0",a?"bg-error-50":"bg-success-50"),children:e.jsx(c,{name:a?"arrow-up":"arrow-down",size:"sm",className:a?"text-error-400":"text-success-400"})}),e.jsxs("div",{className:"flex flex-1 items-center justify-between min-w-0",children:[e.jsxs("div",{className:"flex flex-col min-w-0",children:[e.jsxs("span",{className:"text-sm text-grey-900 truncate",children:[e.jsx("span",{className:"font-normal",children:a?"to":"from"})," ",e.jsx("span",{className:"font-semibold",children:n.name})]}),e.jsx("span",{className:"text-xs font-medium text-grey-400",children:n.category})]}),e.jsxs("span",{className:"text-sm font-semibold text-black shrink-0 ml-4",children:[a?"-":"+"," ",n.amount]})]})]},n.id)})})})]})}s.__docgenInfo={description:"",methods:[],displayName:"RecentTransactionsBlock",props:{title:{required:!1,tsType:{name:"string"},description:"Block title",defaultValue:{value:'"Recent Transactions"',computed:!1}},seeAllLabel:{required:!1,tsType:{name:"string"},description:'"See all" link label',defaultValue:{value:'"See all"',computed:!1}},onSeeAll:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:'"See all" click handler'},transactions:{required:!0,tsType:{name:"Array",elements:[{name:"Transaction"}],raw:"Transaction[]"},description:"Transaction list"},onTransactionClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:"Transaction click handler"},className:{required:!1,tsType:{name:"string"},description:"Additional class names"}}};const T={title:"Blocks/RecentTransactions",component:s,tags:["autodocs"]},r={render:()=>e.jsx("div",{className:"w-[370px] p-6",children:e.jsx(s,{onSeeAll:()=>{},onTransactionClick:t=>console.log("Transaction:",t),transactions:[{id:"1",direction:"outgoing",name:"Market Square",category:"Transfer",amount:"$11,000.00"},{id:"2",direction:"incoming",name:"Aliya Cornrad",category:"Transfer",amount:"$499.00"},{id:"3",direction:"incoming",name:"Martin Stanford",category:"Transfer",amount:"$129.00"},{id:"4",direction:"incoming",name:"Aliya Cornrad",category:"Transfer",amount:"$499.00"},{id:"5",direction:"outgoing",name:"Gabriella Mark",category:"Transfer",amount:"$103.00"},{id:"6",direction:"incoming",name:"Aliya Cornrad",category:"Transfer",amount:"$499.00"}]})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[370px] p-6">
      <RecentTransactionsBlock onSeeAll={() => {}} onTransactionClick={id => console.log("Transaction:", id)} transactions={[{
      id: "1",
      direction: "outgoing",
      name: "Market Square",
      category: "Transfer",
      amount: "$11,000.00"
    }, {
      id: "2",
      direction: "incoming",
      name: "Aliya Cornrad",
      category: "Transfer",
      amount: "$499.00"
    }, {
      id: "3",
      direction: "incoming",
      name: "Martin Stanford",
      category: "Transfer",
      amount: "$129.00"
    }, {
      id: "4",
      direction: "incoming",
      name: "Aliya Cornrad",
      category: "Transfer",
      amount: "$499.00"
    }, {
      id: "5",
      direction: "outgoing",
      name: "Gabriella Mark",
      category: "Transfer",
      amount: "$103.00"
    }, {
      id: "6",
      direction: "incoming",
      name: "Aliya Cornrad",
      category: "Transfer",
      amount: "$499.00"
    }]} />
    </div>
}`,...r.parameters?.docs?.source}}};const h=["Default"];export{r as Default,h as __namedExportsOrder,T as default};
