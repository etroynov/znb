import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { jsxConverter } from '../converters';

type Props = {
  data: SerializedEditorState;
};

export const Serializer = ({ data }: Props) => (
  <RichText className="content" data={data} converters={jsxConverter} />
);
