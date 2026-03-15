import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as j}from"./iframe-g5PiM8Jh.js";import{c as n}from"./cn-C8nBGPD0.js";import{I as C}from"./Icon-CxPrjGB-.js";import"./preload-helper-PPVm8Dsz.js";function x({position:e,theme:o}){const a=o==="dark"?"#101928":"#FFFFFF",c=o==="light"?"#F0F2F5":"none",p=e.startsWith("top"),r=e.startsWith("bottom");e.startsWith("left");const l=e.startsWith("right");if(p||r){const g=e.endsWith("left")?"justify-start pl-4":e.endsWith("right")?"justify-end pr-4":"justify-center";return t.jsx("div",{className:n("flex w-full",g),children:t.jsx("svg",{width:"20",height:"12",viewBox:"0 0 20 12",fill:"none",className:r?"rotate-180":"",children:t.jsx("path",{d:"M10 0L20 12H0L10 0Z",fill:a,stroke:c})})})}const f=e.endsWith("top")?"justify-start pt-4":e.endsWith("bottom")?"justify-end pb-4":"justify-center";return t.jsx("div",{className:n("flex flex-col self-stretch",f),children:t.jsx("svg",{width:"12",height:"20",viewBox:"0 0 12 20",fill:"none",className:l?"rotate-180":"",children:t.jsx("path",{d:"M0 10L12 0V20L0 10Z",fill:a,stroke:c})})})}const i=j.forwardRef(({theme:e="light",position:o="top-left",title:a,content:c,onClose:p,primaryAction:r,secondaryAction:l,className:f,...g},T)=>{const s=e==="dark",b=o.startsWith("left")||o.startsWith("right"),y=o.startsWith("top")||o.startsWith("left"),v=o.startsWith("bottom")||o.startsWith("right");return t.jsxs("div",{ref:T,className:n("inline-flex isolate",b?"flex-row":"flex-col",f),...g,children:[y&&t.jsx("div",{className:"relative z-[2] -mb-px",children:t.jsx(x,{position:o,theme:e})}),t.jsxs("div",{className:n("flex flex-col gap-4 rounded-lg p-4 relative z-[1]",s?"bg-grey-900":"bg-white border border-grey-100"),children:[t.jsxs("div",{className:"flex gap-2 items-start",children:[t.jsxs("div",{className:"flex-1 flex flex-col gap-1 text-sm",children:[a&&t.jsx("p",{className:n("font-semibold",s?"text-white":"text-grey-800"),children:a}),t.jsx("p",{className:s?"text-grey-300":"text-grey-500",children:c})]}),p&&t.jsx("button",{type:"button",onClick:p,className:n("shrink-0 cursor-pointer",s?"text-grey-300 hover:text-white":"text-grey-500 hover:text-grey-700"),"aria-label":"Close",children:t.jsx(C,{name:"multiply",size:"md"})})]}),(r||l)&&t.jsxs("div",{className:"flex items-center justify-between",children:[l&&t.jsx("button",{type:"button",onClick:l.onClick,className:n("text-sm font-semibold cursor-pointer",s?"text-grey-50":"text-grey-500"),children:l.label}),r&&t.jsx("button",{type:"button",onClick:r.onClick,className:n("text-sm font-semibold cursor-pointer",s?"text-primary-400":"text-primary-500"),children:r.label})]})]}),v&&t.jsx("div",{className:"relative z-[2] -mt-px",children:t.jsx(x,{position:o,theme:e})})]})});i.displayName="Tooltip";i.__docgenInfo={description:"",methods:[],displayName:"Tooltip",props:{theme:{required:!1,tsType:{name:"union",raw:'"light" | "dark"',elements:[{name:"literal",value:'"light"'},{name:"literal",value:'"dark"'}]},description:"",defaultValue:{value:'"light"',computed:!1}},position:{required:!1,tsType:{name:"union",raw:`| "top-left"
| "top-center"
| "top-right"
| "bottom-left"
| "bottom-center"
| "bottom-right"
| "left-top"
| "left-center"
| "left-bottom"
| "right-top"
| "right-center"
| "right-bottom"`,elements:[{name:"literal",value:'"top-left"'},{name:"literal",value:'"top-center"'},{name:"literal",value:'"top-right"'},{name:"literal",value:'"bottom-left"'},{name:"literal",value:'"bottom-center"'},{name:"literal",value:'"bottom-right"'},{name:"literal",value:'"left-top"'},{name:"literal",value:'"left-center"'},{name:"literal",value:'"left-bottom"'},{name:"literal",value:'"right-top"'},{name:"literal",value:'"right-center"'},{name:"literal",value:'"right-bottom"'}]},description:"",defaultValue:{value:'"top-left"',computed:!1}},title:{required:!1,tsType:{name:"string"},description:""},content:{required:!0,tsType:{name:"string"},description:""},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},primaryAction:{required:!1,tsType:{name:"TooltipAction"},description:""},secondaryAction:{required:!1,tsType:{name:"TooltipAction"},description:""}},composes:["HTMLAttributes"]};const B={title:"Components/Tooltip",component:i,tags:["autodocs"],argTypes:{theme:{control:"select",options:["light","dark"]},position:{control:"select",options:["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right","left-top","left-center","left-bottom","right-top","right-center","right-bottom"]}}},m={args:{theme:"light",position:"top-left",title:"This is a tooltip",content:"Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand meaning, function.",onClose:()=>{},primaryAction:{label:"Primary CTA",onClick:()=>{}},secondaryAction:{label:"Secondary CTA",onClick:()=>{}}}},d={args:{theme:"dark",position:"top-left",title:"This is a tooltip",content:"Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand meaning, function.",onClose:()=>{},primaryAction:{label:"Primary CTA",onClick:()=>{}},secondaryAction:{label:"Secondary CTA",onClick:()=>{}}}},h={render:()=>t.jsxs("div",{className:"grid grid-cols-3 gap-8 p-8",children:[t.jsx(i,{position:"top-left",content:"Top left tooltip",title:"Tooltip"}),t.jsx(i,{position:"top-center",content:"Top center tooltip",title:"Tooltip"}),t.jsx(i,{position:"top-right",content:"Top right tooltip",title:"Tooltip"}),t.jsx(i,{position:"bottom-left",content:"Bottom left tooltip",title:"Tooltip"}),t.jsx(i,{position:"bottom-center",content:"Bottom center tooltip",title:"Tooltip"}),t.jsx(i,{position:"bottom-right",content:"Bottom right tooltip",title:"Tooltip"})]})},u={args:{content:"Simple tooltip without a title.",onClose:()=>{}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    theme: "light",
    position: "top-left",
    title: "This is a tooltip",
    content: "Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand meaning, function.",
    onClose: () => {},
    primaryAction: {
      label: "Primary CTA",
      onClick: () => {}
    },
    secondaryAction: {
      label: "Secondary CTA",
      onClick: () => {}
    }
  }
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    theme: "dark",
    position: "top-left",
    title: "This is a tooltip",
    content: "Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand meaning, function.",
    onClose: () => {},
    primaryAction: {
      label: "Primary CTA",
      onClick: () => {}
    },
    secondaryAction: {
      label: "Secondary CTA",
      onClick: () => {}
    }
  }
}`,...d.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-3 gap-8 p-8">
      <Tooltip position="top-left" content="Top left tooltip" title="Tooltip" />
      <Tooltip position="top-center" content="Top center tooltip" title="Tooltip" />
      <Tooltip position="top-right" content="Top right tooltip" title="Tooltip" />
      <Tooltip position="bottom-left" content="Bottom left tooltip" title="Tooltip" />
      <Tooltip position="bottom-center" content="Bottom center tooltip" title="Tooltip" />
      <Tooltip position="bottom-right" content="Bottom right tooltip" title="Tooltip" />
    </div>
}`,...h.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    content: "Simple tooltip without a title.",
    onClose: () => {}
  }
}`,...u.parameters?.docs?.source}}};const S=["Light","Dark","Positions","NoTitle"];export{d as Dark,m as Light,u as NoTitle,h as Positions,S as __namedExportsOrder,B as default};
