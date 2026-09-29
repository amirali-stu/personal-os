import type { SetupRecord } from "../services/setupsDb";

export function createDefaultSetups(): Omit<SetupRecord, "id">[] {
  const now = Date.now();
  return [
    {
      title: "مدل ورود اول",
      order: 1,
      conditions:
        "از قسمت تریدینگ پلن اینجا کپی کنید.\n\nشرایط استراتژی این مدل ورود را اینجا بنویسید.",
      diagram: null,
      exampleImages: [null, null, null, null, null, null],
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "مدل ورود دوم",
      order: 2,
      conditions:
        "از قسمت تریدینگ پلن اینجا کپی کنید.\n\nشرایط استراتژی این مدل ورود را اینجا بنویسید.",
      diagram: null,
      exampleImages: [null, null, null, null, null, null],
      createdAt: now + 1,
      updatedAt: now + 1,
    },
    {
      title: "مدل ورود سوم",
      order: 3,
      conditions:
        "از قسمت تریدینگ پلن اینجا کپی کنید.\n\nشرایط استراتژی این مدل ورود را اینجا بنویسید.",
      diagram: null,
      exampleImages: [null, null, null, null, null, null],
      createdAt: now + 2,
      updatedAt: now + 2,
    },
    {
      title: "مدل ورود چهارم",
      order: 4,
      conditions:
        "از قسمت تریدینگ پلن اینجا کپی کنید.\n\nشرایط استراتژی این مدل ورود را اینجا بنویسید.",
      diagram: null,
      exampleImages: [null, null, null, null, null, null],
      createdAt: now + 3,
      updatedAt: now + 3,
    },
  ];
}
