import{j as r}from"./jsx-runtime-u17CrQMm.js";import{B as a}from"./Button-UYlheYCa.js";import"./iframe-g5PiM8Jh.js";import"./preload-helper-PPVm8Dsz.js";import"./cn-C8nBGPD0.js";import"./resolveIcon-B4eesLNI.js";import"./Icon-CxPrjGB-.js";const f={title:"Components/Button",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","grey","destructive","text","success","warning","info"]},appearance:{control:"select",options:["solid","outlined"]},size:{control:"select",options:["sm","lg"]},iconPosition:{control:"select",options:["none","leading","trailing","icon-only"]},disabled:{control:"boolean"}}},e={args:{children:"Label",variant:"primary"}},n={args:{children:"Label",variant:"secondary"}},i={args:{children:"Label",variant:"grey"}},t={args:{children:"Label",variant:"grey",appearance:"outlined"}},s={args:{children:"Label",variant:"destructive"}},o={args:{children:"Label",variant:"destructive",appearance:"outlined"}},c={args:{children:"Label",variant:"text"}},l={args:{children:"Label",variant:"primary",size:"lg"}},d={args:{children:"Label",variant:"primary",icon:"plus",iconPosition:"leading"}},p={args:{children:"Label",variant:"primary",icon:"plus",iconPosition:"trailing"}},u={args:{variant:"primary",icon:"plus",iconPosition:"icon-only"}},m={args:{children:"Label",variant:"primary",disabled:!0}},g={render:()=>r.jsxs("div",{className:"flex flex-col gap-4",children:[r.jsxs("div",{className:"flex items-center gap-3 flex-wrap",children:[r.jsx(a,{variant:"primary",children:"Primary"}),r.jsx(a,{variant:"secondary",children:"Secondary"}),r.jsx(a,{variant:"grey",children:"Grey"}),r.jsx(a,{variant:"grey",appearance:"outlined",children:"Grey Outlined"}),r.jsx(a,{variant:"destructive",children:"Destructive"}),r.jsx(a,{variant:"destructive",appearance:"outlined",children:"Destructive Outlined"}),r.jsx(a,{variant:"text",children:"Text"})]}),r.jsxs("div",{className:"flex items-center gap-3 flex-wrap",children:[r.jsx(a,{variant:"primary",size:"lg",children:"Primary Large"}),r.jsx(a,{variant:"secondary",size:"lg",children:"Secondary Large"}),r.jsx(a,{variant:"grey",size:"lg",children:"Grey Large"})]}),r.jsxs("div",{className:"flex items-center gap-3 flex-wrap",children:[r.jsx(a,{variant:"primary",icon:"plus",iconPosition:"leading",children:"Leading"}),r.jsx(a,{variant:"primary",icon:"plus",iconPosition:"trailing",children:"Trailing"}),r.jsx(a,{variant:"primary",icon:"plus",iconPosition:"icon-only"})]}),r.jsxs("div",{className:"flex items-center gap-3 flex-wrap",children:[r.jsx(a,{variant:"success",children:"Success"}),r.jsx(a,{variant:"warning",children:"Warning"}),r.jsx(a,{variant:"info",children:"Info"})]}),r.jsxs("div",{className:"flex items-center gap-3 flex-wrap",children:[r.jsx(a,{variant:"primary",disabled:!0,children:"Disabled"}),r.jsx(a,{variant:"secondary",disabled:!0,children:"Disabled"}),r.jsx(a,{variant:"grey",disabled:!0,children:"Disabled"})]})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "primary"
  }
}`,...e.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "secondary"
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "grey"
  }
}`,...i.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "grey",
    appearance: "outlined"
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "destructive"
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "destructive",
    appearance: "outlined"
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "text"
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "primary",
    size: "lg"
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "primary",
    icon: "plus",
    iconPosition: "leading"
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "primary",
    icon: "plus",
    iconPosition: "trailing"
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    icon: "plus",
    iconPosition: "icon-only"
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label",
    variant: "primary",
    disabled: true
  }
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="grey">Grey</Button>
        <Button variant="grey" appearance="outlined">Grey Outlined</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="destructive" appearance="outlined">Destructive Outlined</Button>
        <Button variant="text">Text</Button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" size="lg">Primary Large</Button>
        <Button variant="secondary" size="lg">Secondary Large</Button>
        <Button variant="grey" size="lg">Grey Large</Button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" icon="plus" iconPosition="leading">Leading</Button>
        <Button variant="primary" icon="plus" iconPosition="trailing">Trailing</Button>
        <Button variant="primary" icon="plus" iconPosition="icon-only" />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">Info</Button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="secondary" disabled>Disabled</Button>
        <Button variant="grey" disabled>Disabled</Button>
      </div>
    </div>
}`,...g.parameters?.docs?.source}}};const j=["Primary","Secondary","Grey","GreyOutlined","Destructive","DestructiveOutlined","Text","Large","WithLeadingIcon","WithTrailingIcon","IconOnly","Disabled","AllVariants"];export{g as AllVariants,s as Destructive,o as DestructiveOutlined,m as Disabled,i as Grey,t as GreyOutlined,u as IconOnly,l as Large,e as Primary,n as Secondary,c as Text,d as WithLeadingIcon,p as WithTrailingIcon,j as __namedExportsOrder,f as default};
