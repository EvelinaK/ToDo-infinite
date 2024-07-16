import { FunctionComponent, ComponentPropsWithoutRef } from "react";

import styles from "../../style/ui/input.module.scss";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
  id: string;
  indeterminate: boolean;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
  id,
  indeterminate,
  ...props
}) => {
  return (
    <>
      <input
        {...props}
        className={styles.checkbox}
        type="checkbox"
        id={`checkbox-${id}`}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
      />
      <label htmlFor={`checkbox-${id}`} className={styles.checkboxLabel} />
    </>
  );
};

export default Checkbox;
