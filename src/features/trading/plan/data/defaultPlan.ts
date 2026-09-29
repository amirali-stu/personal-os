import type { PlanSection } from "../../services/tradingDb";

function uid() {
  return crypto.randomUUID();
}

export function createDefaultPlanSections(): PlanSection[] {
  return [
    {
      id: uid(),
      title: "ناحیه معتبر تایم بالاتر",
      type: "checklist",
      items: [
        {
          id: uid(),
          text: "ناحیه های معتبر در تایم ۱۵ دقیقه یا بالاتر",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "ناحیه ها را میتوانیم هم به صورت رنج یا بهینه سازی کن",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "آیا در این ناحیه فلیپ یا شکست ساختاری رخ داده است یا خیر",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "این ناحیه پاکسازی شده است یا خیر",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "آیا ایندوسمنتی در مسیر این ناحیه قرار دارد یا خیر",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "میتوانیم هم از ناحیه های ارزان و گران اقدام به ترید کنیم با تایید های بیشتر",
          checked: false,
          type: "checkbox",
        },
      ],
    },
    {
      id: uid(),
      title: "تایم فریم اجرایی",
      type: "checklist",
      items: [
        {
          id: uid(),
          text: "آیا قیمت در تایم یک دقیقه ای نقدینگی را جمع کرده است یا خیر",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "ما فقط زمانی مدل ورود یک دقیقه را ترید میکنیم که وارد ناحیه های معتبر ۱۵ شده باشند",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "باید واکنش قوی در تایم یک دقیقه به صورت وی شکل ببینیم",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "دیدن چاک",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "سپس به دنبال فلیپ هایی که باعث چاک شده اند میگردیم",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "اگر ناحیه فلیپ مشخصی نداشته باشیم میتوانیم از ناحیه های اکستریم ترید را برداریم",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "در ناحیه های بهینه اقدام به ترید میکنیم و استاپ لاس پشت ناحیه قرار میگیرد",
          checked: false,
          type: "checkbox",
        },
      ],
    },
    {
      id: uid(),
      title: "مدیریت ترید",
      type: "checklist",
      items: [
        {
          id: uid(),
          text: "بیرون کشیدن ۲۰ درصد از معامله در ریوارد ۴",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "تارگت کردن سقف یا کف ضعیف ۱۵ دقیقه",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "تارگت کردن بالا و پایین رنج در نواحی که قیمت رنج میزند",
          checked: false,
          type: "checkbox",
        },
      ],
    },
    {
      id: uid(),
      title: "مدیریت ریسک",
      type: "checklist",
      items: [
        {
          id: uid(),
          text: "حداکثر ۳ ضرر در روز",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "ریسک نیم درصد در هر معامله",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "استاپ لاس نباید زیر ۲ پیپ باشد",
          checked: false,
          type: "checkbox",
        },
        {
          id: uid(),
          text: "ما فقط در آغاز تایم فرانکفورت تا بسته شدن لندن اقدام به گرفتن ترید میکنیم",
          checked: false,
          type: "checkbox",
        },
      ],
    },
    {
      id: uid(),
      title: "مپ کردن",
      type: "mapping",
      items: [],
      groups: [
        {
          title: "هفتگی و دیلی",
          items: [
            "مپ کردن سویینگ اخیر",
            "مپ کردن عرضه و تقاضا",
            "مپ کردن ناحیه های پاکسازی و نقدینگی",
          ],
        },
        {
          title: "چهار ساعته",
          items: [
            "مپ کردن چهار ساعته",
            "مپ کردن عرضه و تقاضا",
            "مپ کردن ناحیه های پاکسازی و نقدینگی",
          ],
        },
        {
          title: "پانزده دقیقه",
          items: [
            "مپ کردن سویینگ اخیر",
            "مپ کردن عرضه و تقاضا",
            "مپ کردن ناحیه های پاکسازی و نقدینگی",
          ],
        },
        {
          title: "یک دقیقه",
          items: [
            "منتظر ماندن برای میتیگت شدن ناحیه ۱۵ دقیقه",
            "ترید با مدل های ورود",
            "پیروی از مدیریت معامله",
          ],
        },
      ],
    },
    {
      id: uid(),
      title: "مدل های ورود",
      type: "images",
      items: [],
      images: [null, null, null],
      collapsed: false,
    },
    {
      id: uid(),
      title: "مثال های با احتمال برد بالا",
      type: "images",
      items: [],
      images: [null, null, null],
      collapsed: false,
    },
  ];
}
