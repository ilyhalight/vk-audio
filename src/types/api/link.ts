export type LinkImage = {
  url: string;
  width: number;
  height: number;
};

export type LinkMeta = {
  content_type: "curator";
  track_code: string;
  additional_entities: unknown[];
};

export type Link = {
  id: string;
  image: LinkImage[];
  meta: LinkMeta;
  subtitle: string;
  title: string;
  url: string;
};
