import noop from 'lodash/noop';
import { Button, Dropdown, DropdownMenu, Icon, IconButton } from '@folio/stripes/components';

// IconSelect isn't quite right since this isn't a select its an action menu... no central component for this rn
// FIXME we should add this to kint components or erm components probably
const IconDropdown = ({
  icon = 'ellipsis',
  options = []
}) => {
  return (
    <Dropdown
      renderMenu={() => {
        return (
          <DropdownMenu>
            {options?.map((option) => (
              <Button
                buttonStyle="dropdownItem"
                onClick={option.onClick ?? noop}
              >
                <Icon icon={option.icon ?? 'ellipsis'}>
                  {option.label}
                </Icon>
              </Button>
            ))}
          </DropdownMenu>
        );
      }}
      renderTrigger={({ onToggle, triggerRef, keyHandler, ariaProps, getTriggerProps }) => {
        return (
          <IconButton
            ref={triggerRef}
            icon="ellipsis"
            marginBottom0
            onClick={onToggle}
            onKeyDown={keyHandler}
            type="button"
            {...getTriggerProps()}
            {...ariaProps}
          />
        );
      }}
    />
  );
};

export default IconDropdown;
