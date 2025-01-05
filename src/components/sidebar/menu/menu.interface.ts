export interface MenuIF {
  name: string;
  icon: string;
  path: string;
  sub: subMenuIF[] | [];
  toggle: boolean;
  permission?: string;
  "icon-type"?: string;
}

interface subMenuIF {
  name: string;
  path: string;
  permission?: string;
}
