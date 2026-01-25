import type { PropsWithChildren } from 'react';

type Props = {
  header: any[];
};

export const TwoColumn = ({ header, children }: PropsWithChildren<Props>) => (
  <table className="w-full my-4 border">
    <thead className="bg-neutral-300">
      <tr>
        {header.map((h) => (
          <td key={h} className="p-4 border">
            {h}
          </td>
        ))}
      </tr>
    </thead>

    <tbody>{children}</tbody>
  </table>
);
