import React, {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useRef,
  useEffect,
  useCallback,
  memo,
} from 'react';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import { useHistory } from '@docusaurus/router';
import styles from './styles.module.css';

interface Props {
  readonly children: ReactElement<ComponentProps<'table'>>;
  readonly name?: string;
}

// Utility function to sanitize strings (prevent injection attacks)
function sanitizeString(str: string): string {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ReactNode equivalent of HTMLElement#innerText
function getRowName(node: ReactElement): string {
  let curNode: ReactNode = node;
  while (isValidElement(curNode)) {
    [curNode] = React.Children.toArray(curNode.props.children);
  }
  if (typeof curNode !== 'string') {
    throw new Error(
      `Could not extract APITable row name from JSX tree:\n${JSON.stringify(
        node,
        null,
        2,
      )}`,
    );
  }
  return sanitizeString(curNode as string);  // sanitize the string to prevent HTML injection
}

const APITableRow = memo(
  (
    { name, children }: { name: string | undefined; children: ReactElement<ComponentProps<'tr'>> },
    ref: React.ForwardedRef<HTMLTableRowElement>
  ) => {
    const entryName = getRowName(children);
    const anchor = `#${name ? `${name}-${entryName}` : entryName}`;
    const history = useHistory();
    useBrokenLinks().collectAnchor(anchor); // Collect anchor for broken link detection

    const handleRowClick = useCallback((e: React.MouseEvent) => {
      const isTDClick = (e.target as HTMLElement).tagName.toUpperCase() === 'TD';
      const hasSelectedText = !!window.getSelection()?.toString();

      if (isTDClick && !hasSelectedText) {
        history.push(anchor);
      }
    }, [anchor, history]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          history.push(anchor);
        }
      },
      [anchor, history]
    );

    return (
      <tr
        id={anchor}
        tabIndex={0}
        ref={history.location.hash === anchor ? ref : undefined}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}>
        {children.props.children}
      </tr>
    );
  }
);

const APITableRowComp = React.forwardRef(APITableRow);

/*
 * Note: this component assumes a specific structure for the children elements,
 * which is expected in the MDX context but may not be flexible for all use cases.
 */
export default function APITable({ children, name }: Props): ReactNode {
  if (children.type !== 'table') {
    throw new Error(
      'Bad usage of APITable component.\nMake sure your Markdown table is correctly formatted with the appropriate number of columns for each row.'
    );
  }

  const [thead, tbody] = React.Children.toArray(
    children.props.children
  ) as [
    ReactElement<{ children: ReactElement[] }>,
    ReactElement<{ children: ReactElement[] }>
  ];

  const highlightedRow = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    highlightedRow.current?.focus(); // Focus the first row on render
  }, []);

  const rows = React.Children.map(
    tbody.props.children,
    (row: ReactElement<ComponentProps<'tr'>>) => (
      <APITableRowComp name={name} ref={highlightedRow}>
        {row}
      </APITableRowComp>
    )
  );

  return (
    <table className={styles.apiTable}>
      {thead}
      <tbody>{rows}</tbody>
    </table>
  );
}
