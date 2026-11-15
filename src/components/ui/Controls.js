'use client';

import styled from 'styled-components';
import { Search, X, MoreHorizontal, SlidersHorizontal } from 'lucide-react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { colors, fonts, radii, transitions } from '@/lib/theme';
import { IconButton } from './primitives';

const SearchWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ $width }) => $width || '260px'};
  max-width: 100%;
  height: 36px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.sm};
  background: #fff;
  transition: border-color ${transitions.fast}, box-shadow ${transitions.fast};

  &:focus-within {
    border-color: ${colors.forest};
    box-shadow: 0 0 0 3px rgba(23, 73, 59, 0.08);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const SearchIcon = styled.span`
  display: grid;
  place-items: center;
  padding-left: 11px;
  color: ${colors.faint};
  flex: 0 0 auto;
`;

const SearchField = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  background: transparent;
  outline: none;
  padding: 0 8px;
  font-family: ${fonts.sans};
  font-size: 12.5px;
  color: ${colors.ink};

  &::placeholder {
    color: #A2AAA4;
  }
`;

const ClearButton = styled.button`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  margin-right: 6px;
  border: 0;
  border-radius: 5px;
  background: ${colors.mist};
  color: ${colors.muted};

  &:hover {
    color: ${colors.ink};
  }
`;

export function SearchInput({ value, onChange, placeholder = 'Search…', width, autoFocus, onKeyDown }) {
  return (
    <SearchWrap $width={width}>
      <SearchIcon>
        <Search size={14} />
      </SearchIcon>
      <SearchField
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        aria-label={placeholder}
      />
      {value ? (
        <ClearButton onClick={() => onChange('')} aria-label="Clear search">
          <X size={12} />
        </ClearButton>
      ) : null}
    </SearchWrap>
  );
}

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 14px 18px;
  border-bottom: 1px solid ${colors.lineSoft};

  @media (max-width: 640px) {
    align-items: stretch;

    > div {
      width: 100%;
    }
  }
`;

export const ToolbarSpacer = styled.div`
  flex: 1;
`;

const FilterBarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? colors.forest : colors.line)};
  background: ${({ $active }) => ($active ? colors.forest : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : colors.muted)};
  font-family: ${fonts.sans};
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  transition: all ${transitions.fast};

  &:hover {
    border-color: ${({ $active }) => ($active ? colors.forest : '#C9C3B5')};
    color: ${({ $active }) => ($active ? '#fff' : colors.ink)};
  }

  small {
    font-size: 10px;
    opacity: 0.7;
    font-weight: 700;
  }
`;

export function FilterChips({ options, value, onChange }) {
  return (
    <FilterBarWrap role="group" aria-label="Filters">
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const count = typeof option === 'string' ? undefined : option.count;
        const active = value === optionValue;
        return (
          <FilterButton
            key={optionValue}
            $active={active}
            onClick={() => onChange(optionValue)}
            aria-pressed={active}
          >
            {label}
            {typeof count === 'number' ? <small>{count}</small> : null}
          </FilterButton>
        );
      })}
    </FilterBarWrap>
  );
}

const SelectWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  svg {
    position: absolute;
    right: 9px;
    pointer-events: none;
    color: ${colors.faint};
  }
`;

const MiniSelect = styled.select`
  height: 34px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.sm};
  background: #fff;
  padding: 0 28px 0 10px;
  font-family: ${fonts.sans};
  font-size: 11.5px;
  font-weight: 600;
  color: ${colors.inkSoft};
  appearance: none;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${colors.forest};
  }
`;

export function QuickSelect({ options, value, onChange, label }) {
  return (
    <SelectWrap>
      <MiniSelect value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </MiniSelect>
      <SlidersHorizontal size={12} />
    </SelectWrap>
  );
}

const SegmentedWrap = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 3px;
  gap: 2px;
  border-radius: ${radii.sm};
  background: #EFECE4;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Segment = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 0;
  border-radius: 7px;
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(16,35,29,0.12)' : 'none')};
  color: ${({ $active }) => ($active ? colors.ink : colors.muted)};
  font-family: ${fonts.sans};
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
  transition: all ${transitions.fast};

  &:hover {
    color: ${colors.ink};
  }

  small {
    font-size: 9.5px;
    font-weight: 700;
    background: ${({ $active }) => ($active ? colors.copperWash : '#E2DED4')};
    color: ${({ $active }) => ($active ? colors.copperDeep : colors.muted)};
    border-radius: 999px;
    padding: 1px 5px;
  }
`;

export function Segmented({ options, value, onChange, label = 'View options' }) {
  return (
    <SegmentedWrap role="group" aria-label={label}>
      {options.map((option) => (
        <Segment
          key={option.value}
          $active={value === option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
          {typeof option.count === 'number' ? <small>{option.count}</small> : null}
        </Segment>
      ))}
    </SegmentedWrap>
  );
}

const MenuWrap = styled.div`
  display: inline-flex;
  justify-content: flex-end;
`;

export function RowMenu({ items, label = 'Row actions' }) {
  return (
    <MenuWrap onClick={(event) => event.stopPropagation()}>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <IconButton $size="sm" aria-label={label} type="button">
            <MoreHorizontal size={16} />
          </IconButton>
        </DropdownTrigger>
        <DropdownMenu
          aria-label={label}
          className="min-w-[190px] border border-[#E5E0D5] bg-white p-1 shadow-lg"
          itemClasses={{
            base: 'rounded-md data-[hover=true]:bg-[#F6F4EE] py-2',
            title: 'text-[12px] font-medium text-[#16241F]',
          }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownItem
                key={item.key || item.label}
                onPress={item.onSelect}
                startContent={Icon ? <Icon size={14} /> : null}
                className={item.danger ? 'text-[#B0472F]' : 'text-[#16241F]'}
                color={item.danger ? 'danger' : 'default'}
              >
                {item.label}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </MenuWrap>
  );
}
