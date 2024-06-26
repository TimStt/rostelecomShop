import { profile } from "console";

export const paths = {
  home: "/",
  catalog: "/catalog?page=1",
  profile: (id: string) => `/profile?id=${id}`,
  login: "/login",
  compare: "/compare",
  register: "/register",
  basket: "/basket",
  contact: "/contact",
  favorites: "/favorites",
  customers: "/customers",
  blog: "/blog",
};

export const catalogPaths = {
  clothes: `/catalog/clothes?page=1`,
  accessories: `/catalog/accessories?page=1`,
  souvenirs: `/catalog/souvenirs?page=1`,
  chancellery: `/catalog/chancellery?page=1`,
  outerwear: `/catalog/outerwear?page=1`,
  t_shirts: `/catalog/clothes?type=t-shirt&page=1`,
  longsleeves: `/catalog/longsleeves?type=longsleeves&page=1`,
  hoodie: `/catalog/clothes/?type=hoodie&page=1`,
  umbrellas: `/catalog/accessories/?type=umbrella&page=1`,
  promotional_gifts: `/catalog/souvenirs/?type=promotional-gifts&page=1`,
  hats: `/catalog/accessories?type=hat&page=1`,
};

export const catalogPathsTypes = {
  clothes: "Clothes",
  accessories: "Accessories",
};

export const translateWords = {
  home: "Главная",
  catalog: "Каталог",
  profile: "Профиль",
  personal_data_policy: "Политика обработки персональных данных",
  clothes: "Одежда",
  accessories: "Аксессуары",
  souvenirs: "Сувениры",
  all: "Все",
  office: "Канцелярия",
  popularity: "Популярные",
  first_the_cheap_ones: "Сначала дорогие",
  firstly_expensive: "Сначала дешевые",
  isNew: "Новинки",
  login: "Войти",
  compare: "Сравнение товаров",
  register: "Регистрация",
  basket: "Корзина",
  contact: "Контакты",
  favorites: "Избранные товары",
  customers: "Клиенты",
  blog: "Блог",
  order: "Оформление заказа",
  t_shirt: "Футболки",
  long_sleeves: "Лонг-сливы",
  hoodie: "Худи",
  outerwear: "Верхняя одежда",
  bags: "Сумки",
  headdress: "Головные уборы",
  umbrella: "Зонты",
  business_souvenirs: "Бизнес-сувениры",
  promotional_souvenirs: "Промо-сувениры",
  pen: "Ручки",
  notebook: "Тетради",
};

export const translateColors = {
  black: "Чёрный",
  white: "Белый",
  red: "Красный",
  blue: "Синий",
  green: "Зеленый",
  yellow: "Жёлтый",
  orange: "Оранжевый",
  brown: "Коричневый",
  pink: "Розовый",
  purple: "Фиолетовый",
  gray: "Серый",
};
