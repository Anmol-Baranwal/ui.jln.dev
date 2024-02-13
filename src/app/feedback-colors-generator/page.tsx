"use client";

import { CopyButton } from "@/client/components/copy-button";
import { Alert } from "@/client/components/customizable/alert";
import { Support } from "@/client/components/headline";
import { Logo } from "@/client/components/logo";
import { ThemeSwitch } from "@/client/components/theme-switch";
import { Alert as MyAlert } from "@/client/components/ui/alert";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { cn } from "@/client/lib/cn";
import { createContrast } from "@/client/lib/create-contrast";
import { hslToVariableValue } from "@/client/lib/hsl-to-variable-value";

import { colord, type HslaColor } from "colord";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Info } from "lucide-react";
import { keys } from "remeda";

const Page = () => {
  return (
    <div>
      <div className="container py-24">
        <div className="flex flex-col items-center gap-6">
          <Logo className="size-10" />
          <h1
            className={cn(
              "relative flex flex-wrap items-center justify-center gap-2 text-lg font-bold max-lg:text-center lg:text-5xl",
            )}
          >
            Generate
            <span className="rounded-lg bg-primary px-2 py-1  tabular-nums text-primary-foreground lg:px-4 lg:py-2">
              Feedback Colors
            </span>
            for shadcn/ui
          </h1>

          <div className="pt-6">
            <Support />
          </div>
        </div>

        <div className="flex flex-col gap-20">
          <Generate />
          <Tailwind />
          <Styles />
          <Variants />
        </div>
      </div>
    </div>
  );
};

const Generate = () => {
  const [, generate] = useColors();

  return (
    <div>
      <Step step={1} title="Generate Colors" />
      <div className="flex justify-center py-4">
        <ThemeSwitch />
        <CopyButton value="123" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <Feedback name="success" />
        <Feedback name="destructive" />
        <Feedback name="warning" />
        <Feedback name="info" />
        <div className="grid w-full grid-cols-4 gap-4">
          <div className="col-start-4">
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                generate("destructive");
                generate("success");
                generate("warning");
                generate("info");
              }}
            >
              Randomize All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tailwind = () => {
  const codeString = `destructive: {
  DEFAULT: "hsl(var(--destructive))",
  foreground: "hsl(var(--destructive-foreground))",
},
success: {
  DEFAULT: "hsl(var(--success))",
  foreground: "hsl(var(--success-foreground))",
},
warning: {
  DEFAULT: "hsl(var(--warning))",
  foreground: "hsl(var(--warning-foreground))",
},
info: {
  DEFAULT: "hsl(var(--info))",
  foreground: "hsl(var(--info-foreground))",
}
`;

  return (
    <div>
      <Step step={2} title="Add to Tailwind Config" />

      <div className="py-2">
        <MyAlert variant="warning" size="sm">
          Make sure you followed the{" "}
          <a
            href="https://ui.shadcn.com/docs/installation/manual"
            className="font-bold underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            installation guide
          </a>{" "}
          for shadcn/ui.
        </MyAlert>
      </div>

      <p className="pb-4 pt-6">
        Add the colors to your config file. (Nested under theme ➡︎ extend ➡︎
        colors). Just search for{" "}
        <span className="font-medium">destructive</span> in your current config
        and insert it below.
      </p>
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          tailwind.config.js
        </p>

        <pre>
          <code className="relative block max-h-[800px] rounded bg-muted px-2 py-3 font-mono text-xs lg:text-sm">
            {codeString}
            <div className="absolute right-2 top-2">
              <CopyButton value={codeString} />
            </div>
          </code>
        </pre>
      </div>
    </div>
  );
};

const Styles = () => {
  const [colors] = useColors();

  const space = `      `;

  const pairs = Object.entries(colors);

  const toOutput = (
    key: string,
    background: HslaColor,
    foreground: HslaColor,
  ) => {
    return `${space}--${key}: ${hslToVariableValue(
      background,
    )};\n${space}--${key}-foreground: ${hslToVariableValue(foreground)};`;
  };

  const light = pairs
    .map(([key, value]) =>
      toOutput(
        key,
        value.colors.light.background,
        value.colors.light.foreground,
      ),
    )
    .join("\n");

  const dark = pairs
    .map(([key, value]) =>
      toOutput(key, value.colors.dark.background, value.colors.dark.foreground),
    )
    .join("\n");

  const codeString = `@layer base {
    :root {
${light}
    }
  
    .dark {
${dark}
    }
  }
`;

  return (
    <div>
      <Step step={3} title="Add Styles" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">globals.css</p>

        <pre>
          <code className="relative block max-h-[800px] rounded bg-muted px-2 py-3 font-mono text-xs lg:text-sm">
            {codeString}
            <div className="absolute right-2 top-2">
              <CopyButton value={codeString} />
            </div>
          </code>
        </pre>
      </div>
    </div>
  );
};

const Variants = () => {
  const variantKeys = keys.strict(variants);

  return (
    <div>
      <Step step={4} title="Optional: Add Variants" />
      <p className="pb-4">Add new variants to your components.</p>

      <Tabs defaultValue="button">
        <TabsList>
          {variantKeys.map((variant) => (
            <TabsTrigger key={variant} value={variant} className="capitalize">
              {variant}
            </TabsTrigger>
          ))}
        </TabsList>
        {variantKeys.map((variant) => (
          <TabsContent key={variant} value={variant}>
            <VariantTabContent variant={variant} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const variants = {
  button: [
    'destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive-foreground/10"',
    'success: "bg-success text-success-foreground hover:bg-success/90 border border-success-foreground/10"',
    'warning: "bg-warning text-warning-foreground hover:bg-warning/90 border border-warning-foreground/10"',
    'info: "bg-info text-info-foreground hover:bg-info/90 border border-info-foreground/10"',
  ],
  badge: [
    'destructive: "bg-destructive text-destructive-foreground border border-destructive-foreground/10"',
    'success: "bg-success text-success-foreground border border-success-foreground/10"',
    'warning: "bg-warning text-warning-foreground border border-warning-foreground/10"',
    'info: "bg-info text-info-foreground border border-info-foreground/10"',
  ],
  alert: [
    'destructive: "bg-destructive text-destructive-foreground border border-destructive-foreground/10"',
    'success: "bg-success text-success-foreground border border-success-foreground/10"',
    'warning: "bg-warning text-warning-foreground border border-warning-foreground/10"',
    'info: "bg-info text-info-foreground border border-info-foreground/10"',
  ],
};

const VariantTabContent = ({ variant }: { variant: keyof typeof variants }) => {
  const code = variants[variant];
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{`@/components/ui/${variant}.tsx`}</p>
      <CodeBlock code={code.join(",\n")} />
    </div>
  );
};

const CodeBlock = ({ code }: { code: string }) => {
  return (
    <pre>
      <code className="relative block max-h-[800px] rounded bg-muted px-2 py-3 font-mono text-xs lg:text-sm">
        {code}
        <div className="absolute right-2 top-2">
          <CopyButton value={code} />
        </div>
      </code>
    </pre>
  );
};

const Step = ({ step, title }: { step: number; title: string }) => {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="grid size-12 place-items-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
        {step}
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
};

const ranges = {
  destructive: {
    light: {
      h: { min: 0, max: 15 },
      s: { min: 40, max: 100 },
      l: { min: 20, max: 45 },
    },
    dark: {
      h: { min: 0, max: 15 },
      s: { min: 40, max: 100 },
      l: { min: 20, max: 45 },
    },
  },

  success: {
    light: {
      h: { min: 90, max: 160 },
      s: { min: 40, max: 100 },
      l: { min: 40, max: 60 },
    },
    dark: {
      h: { min: 90, max: 160 },
      s: { min: 40, max: 100 },
      l: { min: 40, max: 60 },
    },
  },

  warning: {
    light: {
      h: { min: 15, max: 55 },
      s: { min: 40, max: 100 },
      l: { min: 40, max: 60 },
    },
    dark: {
      h: { min: 15, max: 55 },
      s: { min: 40, max: 100 },
      l: { min: 40, max: 60 },
    },
  },

  info: {
    light: {
      h: { min: 180, max: 240 },
      s: { min: 40, max: 100 },
      l: { min: 40, max: 60 },
    },
    dark: {
      h: { min: 180, max: 240 },
      s: { min: 40, max: 100 },
      l: { min: 40, max: 60 },
    },
  },
};

type Feedback = keyof typeof ranges;

const Feedback = ({ name }: { name: Feedback }) => {
  const [colors, generate] = useColors();

  const pair = colors[name].colors.light;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <Alert
          className="col-span-3 bg-[hsl(var(--bg))] capitalize text-[hsl(var(--fg))]"
          style={{
            // @ts-expect-error idc
            "--bg": hslToVariableValue(pair.background),
            "--fg": hslToVariableValue(pair.foreground),
          }}
        >
          {name}
        </Alert>
        <Button
          variant="outline"
          className="h-full w-full gap-2 rounded-lg border text-foreground"
          onClick={() => generate(name)}
        >
          Randomize
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="flex items-center gap-2">
                {colord(pair.background).contrast(colord(pair.foreground))}
                <Info className="size-3" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Contrast ratio:{" "}
              {colord(pair.background).contrast(colord(pair.foreground))}
            </TooltipContent>
          </Tooltip>
        </Button>
      </div>
    </div>
  );
};

function randomNumberInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const des = generate({
  h: { min: 0, max: 15 },
  s: { min: 40, max: 100 },
  l: { min: 20, max: 45 },
});

const atom = atomWithStorage("colors", {
  destructive: {
    colors: {
      light: des,
      dark: des,
    },
    isLocked: false,
  },
  success: {
    colors: {
      light: des,
      dark: des,
    },
    isLocked: false,
  },
  warning: {
    colors: {
      light: des,
      dark: des,
    },
    isLocked: false,
  },
  info: {
    colors: {
      light: des,
      dark: des,
    },
    isLocked: false,
  },
});

const useColors = () => {
  const [colors, setColors] = useAtom(atom);

  const generateColor = (name: Feedback) => {
    const range = ranges[name];
    const pair = generate(range.light);

    setColors((prev) => ({
      ...prev,
      [name]: {
        colors: {
          light: pair,
          dark: pair,
        },
        isLocked: false,
      },
    }));
  };

  return [colors, generateColor] as const;
};

function generate(range: {
  h: { min: number; max: number };
  s: { min: number; max: number };
  l: { min: number; max: number };
}) {
  const base = colord({
    h: randomNumberInRange(range.h.min, range.h.max),
    s: randomNumberInRange(range.s.min, range.s.max),
    l: randomNumberInRange(range.l.min, range.l.max),
  });

  const foreground = createContrast(base);

  return {
    background: base.toHsl(),
    foreground: foreground.toHsl(),
  };
}

export default Page;