import { useNode } from "@craftjs/core";
import { Component, useEffect, useState } from "react";
import Select, { MultiValue, components, createFilter } from "react-select";
import { suggestions } from "~/lib/tw-classes";
import { Option } from "react-tailwindcss-select/dist/components/type";
import { FixedSizeList as List } from "react-window";

const selectOptions = suggestions.map((value) => ({ label: value, value }));

const selectStyles = {
  control: (base: any) => ({
    ...base,
    color: "#000",
    backgroundColor: "#fff",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#fff",
  }),
  option: (base: any, state: any) => ({
    ...base,
    color: "#000",
    backgroundColor: state.isFocused ? "#f3f4f6" : "#fff",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#000",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#000",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#6b7280", // gray-500
  }),
  input: (base: any) => ({
    ...base,
    color: "#000",
  }),
};

const height = 35;

interface MenuListProps {
  options: any[];
  children: any[];
  maxHeight: number;
  getValue: () => any[];
}

class MenuList extends Component<MenuListProps> {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        width={"100%"}
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}

const CustomOption = (props: any) => {
  // Remove the niceties for mouseover and mousemove to optimize for large lists
  // eslint-disable-next-line no-unused-vars
  const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
  const newProps = { ...props, innerProps: rest };
  return (
    <components.Option {...newProps}>
      <div className="text-xs">{props.children}</div>
    </components.Option>
  );
};

export const ClassNameSelector = () => {
  const {
    classNames,
    actions: { setProp },
  } = useNode((node) => ({
    classNames: node.data.props["className"] as string,
  }));

  const tailwindcssArr = classNames
    ? classNames.split(" ").filter(Boolean)
    : [];

  const initialOptions = tailwindcssArr.map((value) => ({
    label: value,
    value,
  }));

  useEffect(() => {
    const tailwindcssArr = classNames
      ? classNames.split(" ").filter(Boolean)
      : [];

    const newOptions = tailwindcssArr.map((value) => ({
      label: value,
      value,
    }));

    setValue(newOptions);
  }, [classNames]);

  const [value, setValue] = useState<MultiValue<Option>>(initialOptions);

  return (
    <Select
      options={selectOptions}
      styles={selectStyles}
      isSearchable
      isClearable={false}
      components={{ MenuList: MenuList as any, Option: CustomOption }}
      isMulti
      placeholder={"Add new class"}
      value={value}
      filterOption={createFilter({ ignoreAccents: false })}
      onChange={(option) => {
        if (option && Array.isArray(option)) {
          const classNames = option.map((item) => item.value).join(" ");
          setProp((props: { className: string }) => {
            console.log("Setting props ", props.className);
            props.className = classNames;
          });
        }

        if (!option) {
          setProp((props: { className: string }) => (props.className = ""));
        }

        setValue(option);
      }}
    />
  );
};
