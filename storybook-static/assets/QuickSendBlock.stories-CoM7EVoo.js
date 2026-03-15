import{j as e}from"./jsx-runtime-u17CrQMm.js";import{c as m}from"./cn-C8nBGPD0.js";import{I as p}from"./Icon-CxPrjGB-.js";import{A as t}from"./Avatar-BvmkuJdv.js";import"./iframe-g5PiM8Jh.js";import"./preload-helper-PPVm8Dsz.js";import"./resolveIcon-B4eesLNI.js";function s({title:i="Quick Send",seeAllLabel:l="See all beneficaries",onSeeAll:r,beneficiaries:d,onSelect:c,className:o}){return e.jsxs("div",{className:m("flex flex-col gap-3",o),children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"text-lg font-semibold text-grey-900",children:i}),r&&e.jsxs("button",{type:"button",onClick:r,className:"flex items-center gap-1.5 text-xs font-semibold text-primary-500",children:[l,e.jsx(p,{name:"chevron-right",size:"xs"})]})]}),e.jsx("div",{className:"bg-white border border-grey-100 rounded-[10px] px-6 py-6",children:e.jsx("div",{className:"flex gap-5 overflow-x-auto",children:d.map(a=>e.jsxs("button",{type:"button",onClick:()=>c?.(a.id),className:"flex flex-col items-center gap-2 shrink-0 group",children:[a.avatar??e.jsx(t,{type:"initials",initials:a.initials??a.name.slice(0,2).toUpperCase(),size:"lg"}),e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("span",{className:"text-xs font-semibold text-grey-900 whitespace-nowrap max-w-[80px] truncate",children:a.name}),e.jsxs("span",{className:"text-xs text-grey-400 whitespace-nowrap",children:["@",a.handle]})]})]},a.id))})})]})}s.__docgenInfo={description:"",methods:[],displayName:"QuickSendBlock",props:{title:{required:!1,tsType:{name:"string"},description:"Block title",defaultValue:{value:'"Quick Send"',computed:!1}},seeAllLabel:{required:!1,tsType:{name:"string"},description:'"See all" link label',defaultValue:{value:'"See all beneficaries"',computed:!1}},onSeeAll:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:'"See all" click handler'},beneficiaries:{required:!0,tsType:{name:"Array",elements:[{name:"QuickSendBeneficiary"}],raw:"QuickSendBeneficiary[]"},description:"Beneficiary list"},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:"Beneficiary click handler"},className:{required:!1,tsType:{name:"string"},description:"Additional class names"}}};const S={title:"Blocks/QuickSend",component:s,tags:["autodocs"]},n={render:()=>e.jsx("div",{className:"w-[695px] p-6",children:e.jsx(s,{onSeeAll:()=>{},onSelect:i=>console.log("Selected:",i),beneficiaries:[{id:"1",name:"Ariana Bush",handle:"ariana007",avatar:e.jsx(t,{type:"image",src:"https://i.pravatar.cc/150?img=47",size:"lg"})},{id:"2",name:"Madelyn Ma...",handle:"made.ngo",initials:"MM"},{id:"3",name:"Zain Siphron",handle:"zainsiphron",initials:"ZS"},{id:"4",name:"Zain Curtis",handle:"zain_c",avatar:e.jsx(t,{type:"image",src:"https://i.pravatar.cc/150?img=26",size:"lg"})},{id:"5",name:"Martin Stan...",handle:"themartin",initials:"MS"},{id:"6",name:"Aliya Cornrad",handle:"aliya_rd",initials:"AC"},{id:"7",name:"Jakob West...",handle:"jakobw",initials:"JW"}]})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[695px] p-6">
      <QuickSendBlock onSeeAll={() => {}} onSelect={id => console.log("Selected:", id)} beneficiaries={[{
      id: "1",
      name: "Ariana Bush",
      handle: "ariana007",
      avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=47" size="lg" />
    }, {
      id: "2",
      name: "Madelyn Ma...",
      handle: "made.ngo",
      initials: "MM"
    }, {
      id: "3",
      name: "Zain Siphron",
      handle: "zainsiphron",
      initials: "ZS"
    }, {
      id: "4",
      name: "Zain Curtis",
      handle: "zain_c",
      avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=26" size="lg" />
    }, {
      id: "5",
      name: "Martin Stan...",
      handle: "themartin",
      initials: "MS"
    }, {
      id: "6",
      name: "Aliya Cornrad",
      handle: "aliya_rd",
      initials: "AC"
    }, {
      id: "7",
      name: "Jakob West...",
      handle: "jakobw",
      initials: "JW"
    }]} />
    </div>
}`,...n.parameters?.docs?.source}}};const k=["Default"];export{n as Default,k as __namedExportsOrder,S as default};
