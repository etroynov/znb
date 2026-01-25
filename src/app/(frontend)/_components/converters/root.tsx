import type {
  DefaultNodeTypes,
  SerializedBlockNode,
} from '@payloadcms/richtext-lexical';
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';
import Image from 'next/image';
import type { Media } from '@/payload-types';
import { TwoColumn } from '../twoColumn';
import { textConverters } from './text';

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<any>;

const isMedia = (image: unknown): image is Media =>
  typeof image === 'object' && image !== null && 'url' in image;

export const jsxConverter: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...textConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag;
    let cn = 'font-bold mb-4 ';

    switch (node.tag) {
      case 'h1':
        cn += 'text-3xl';
        break;

      case 'h2':
        cn += 'text-2xl';
        break;

      default:
        cn += 'text-base';
        break;
    }

    return <Tag className={cn}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
  blocks: {
    'two-column': ({ node, nodesToJSX }) => (
      <TwoColumn header={[node.fields.firstTitle, node.fields.secondTitle]}>
        {node.fields.rows.map((r: any) => (
          <tr key={r?.id}>
            <td className="p-2 border">
              {isMedia(r.image) ? (
                <Image
                  src={r.image?.url ?? ''}
                  alt={r.image.alt}
                  width={450}
                  height={450}
                />
              ) : null}
            </td>
            <td className="p-2 border content-start">
              {nodesToJSX({ nodes: r.description.root.children })}
            </td>
          </tr>
        ))}
      </TwoColumn>
    ),
  },
});
