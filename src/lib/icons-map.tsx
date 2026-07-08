import { Icons } from "@/components/icons";
import { HomeIcon, GlobeIcon, MailIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Golang } from "@/components/ui/svgs/golang";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Java } from "@/components/ui/svgs/java";
import { Csharp } from "@/components/ui/svgs/csharp";
import type { ReactNode } from "react";

export const skillIconMap: Record<string, ReactNode> = {
  ReactLight: <ReactLight />,
  NextjsIconDark: <NextjsIconDark />,
  Typescript: <Typescript />,
  Nodejs: <Nodejs />,
  Python: <Python />,
  Golang: <Golang />,
  Postgresql: <Postgresql />,
  Docker: <Docker />,
  Kubernetes: <Kubernetes />,
  Java: <Java />,
  Csharp: <Csharp />,
};

const iconComponents: Record<string, (props: any) => ReactNode> = {
  home: (props) => <HomeIcon {...props} />,

  github: (props) => <Icons.github {...props} />,
  linkedin: (props) => <Icons.linkedin {...props} />,
  x: (props) => <Icons.x {...props} />,
  youtube: (props) => <Icons.youtube {...props} />,
  email: (props) => <MailIcon {...props} />,
  globe: (props) => <GlobeIcon {...props} />,
  nextjs: (props) => <Icons.nextjs {...props} />,
  framermotion: (props) => <Icons.framermotion {...props} />,
  tailwindcss: (props) => <Icons.tailwindcss {...props} />,
  typescript: (props) => <Icons.typescript {...props} />,
  react: (props) => <Icons.react {...props} />,
  notion: (props) => <Icons.notion {...props} />,
  openai: (props) => <Icons.openai {...props} />,
  googleDrive: (props) => <Icons.googleDrive {...props} />,
  whatsapp: (props) => <Icons.whatsapp {...props} />,
  instagram: (props) => <Icons.instagram {...props} />,
  facebook: (props) => <Icons.facebook {...props} />,
  tiktok: (props) => <Icons.tiktok {...props} />,
  telegram: (props) => <Icons.telegram {...props} />,
  discord: (props) => <Icons.discord {...props} />,
};

export function getIcon(name: string | undefined | null, props?: any) {
  if (!name) return null;
  const component = iconComponents[name.toLowerCase()];
  if (component) return component(props);
  return null;
}
