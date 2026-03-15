import{j as e}from"./jsx-runtime-u17CrQMm.js";import{I as r}from"./Input-Cde_iS42.js";import"./iframe-g5PiM8Jh.js";import"./preload-helper-PPVm8Dsz.js";import"./cn-C8nBGPD0.js";import"./resolveIcon-B4eesLNI.js";import"./Icon-CxPrjGB-.js";const l=()=>e.jsxs("svg",{viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:2,children:[e.jsx("circle",{cx:"9",cy:"9",r:"5"}),e.jsx("path",{d:"M13 13l4 4"})]}),a=()=>e.jsxs("svg",{viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:1.5,children:[e.jsx("rect",{x:"2",y:"4",width:"16",height:"12",rx:"2"}),e.jsx("path",{d:"M2 4l8 6 8-6"})]}),i=()=>e.jsxs("svg",{viewBox:"0 0 20 20",fill:"none",stroke:"#5FC381",strokeWidth:2,children:[e.jsx("circle",{cx:"10",cy:"10",r:"7"}),e.jsx("path",{d:"M7 10l2 2 4-4"})]}),p=()=>e.jsxs("svg",{viewBox:"0 0 20 20",fill:"none",stroke:"#E26E6A",strokeWidth:2,children:[e.jsx("circle",{cx:"10",cy:"10",r:"7"}),e.jsx("path",{d:"M10 7v4M10 13h0"})]}),b={title:"Components/Input",component:r,tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","lg"]},disabled:{control:"boolean"},readOnly:{control:"boolean"}}},n={args:{label:"Label",placeholder:"Placeholder",helperText:"Helper text",leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(a,{})}},o={args:{label:"Label",placeholder:"Placeholder",helperText:"Helper text",size:"lg",leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(a,{})}},c={args:{label:"Label",placeholder:"Placeholder",defaultValue:"Input",success:"Success text",leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(i,{})}},t={args:{label:"Label",placeholder:"Placeholder",defaultValue:"Input",error:"Error text",leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(p,{})}},s={args:{label:"Label",placeholder:"Placeholder",helperText:"Helper text",readOnly:!0,leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(a,{})}},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 w-[375px]",children:[e.jsx(r,{label:"Default",placeholder:"Placeholder",helperText:"Helper text",leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(a,{})}),e.jsx(r,{label:"Filled",placeholder:"Placeholder",defaultValue:"Input",helperText:"Helper text",leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(a,{})}),e.jsx(r,{label:"Success",placeholder:"Placeholder",defaultValue:"Input",success:"Success text",leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(i,{})}),e.jsx(r,{label:"Error",placeholder:"Placeholder",defaultValue:"Input",error:"Error text",leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(p,{})}),e.jsx(r,{label:"Read Only",placeholder:"Placeholder",helperText:"Helper text",readOnly:!0,leadingIcon:e.jsx(l,{}),trailingIcon:e.jsx(a,{})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper text",
    leadingIcon: <SearchIcon />,
    trailingIcon: <MailIcon />
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper text",
    size: "lg",
    leadingIcon: <SearchIcon />,
    trailingIcon: <MailIcon />
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Label",
    placeholder: "Placeholder",
    defaultValue: "Input",
    success: "Success text",
    leadingIcon: <SearchIcon />,
    trailingIcon: <CheckIcon />
  }
}`,...c.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Label",
    placeholder: "Placeholder",
    defaultValue: "Input",
    error: "Error text",
    leadingIcon: <SearchIcon />,
    trailingIcon: <ErrorIcon />
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper text",
    readOnly: true,
    leadingIcon: <SearchIcon />,
    trailingIcon: <MailIcon />
  }
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 w-[375px]">
      <Input label="Default" placeholder="Placeholder" helperText="Helper text" leadingIcon={<SearchIcon />} trailingIcon={<MailIcon />} />
      <Input label="Filled" placeholder="Placeholder" defaultValue="Input" helperText="Helper text" leadingIcon={<SearchIcon />} trailingIcon={<MailIcon />} />
      <Input label="Success" placeholder="Placeholder" defaultValue="Input" success="Success text" leadingIcon={<SearchIcon />} trailingIcon={<CheckIcon />} />
      <Input label="Error" placeholder="Placeholder" defaultValue="Input" error="Error text" leadingIcon={<SearchIcon />} trailingIcon={<ErrorIcon />} />
      <Input label="Read Only" placeholder="Placeholder" helperText="Helper text" readOnly leadingIcon={<SearchIcon />} trailingIcon={<MailIcon />} />
    </div>
}`,...d.parameters?.docs?.source}}};const S=["Default","Large","WithSuccess","WithError","ReadOnly","AllStates"];export{d as AllStates,n as Default,o as Large,s as ReadOnly,t as WithError,c as WithSuccess,S as __namedExportsOrder,b as default};
