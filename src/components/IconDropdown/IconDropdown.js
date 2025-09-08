import noop from 'lodash/noop';
import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
  IconButton, Tooltip,
} from '@folio/stripes/components';

// IconSelect isn't quite right since this isn't a select its an action menu... no central component for this rn
// FIXME we should add this to kint components or erm components probably
const IconDropdown = ({
  icon = 'ellipsis',
  id,
  options = [],
  triggerProps: {
    tooltipProps = {},
    ...triggerProps
  } = {}
}) => {
  return (
    <Dropdown
      renderMenu={() => {
        return (
          <DropdownMenu>
            {options?.map((option, optInd) => (
              <Button
                key={
                  option?.key ??
                  (
                    id ?
                      `${id}-option-${option?.id ?? optInd}` :
                      `icon-dropdown-option-${option?.id ?? optInd}`
                  )
                }
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
        const renderIconButtonWithRef = (theRef, iconButtonProps = {}) => (
          <IconButton
            ref={theRef}
            icon={icon}
            marginBottom0
            onClick={onToggle}
            onKeyDown={keyHandler}
            type="button"
            {...getTriggerProps()}
            {...ariaProps}
            {...triggerProps}
            {...iconButtonProps}
          />
        );

        if (Object.keys(tooltipProps).length > 0) {
          return (
            <Tooltip
              triggerRef={triggerRef}
              {...tooltipProps}
            >
              {({ ref, ariaIds }) => (
                renderIconButtonWithRef(
                  ref,
                  {
                    'aria-labelledby': ariaIds.text,
                    'aria-describedby': ariaIds.sub,
                  }
                )
              )}
            </Tooltip>
          );
        }
        return renderIconButtonWithRef(triggerRef);
      }}
    />
  );
};

export default IconDropdown;
