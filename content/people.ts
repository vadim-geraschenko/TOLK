type Person = {
  name: string;
  avatar: string;
};

export const people = {
  taras: {
    name: "Тарас",
    avatar: "/home/assets/host-taras.webp",
  },
  murat: {
    name: "Мурат",
    avatar: "/home/assets/host-murat.webp",
  },
  valentin: {
    name: "Валентин",
    avatar: "/home/assets/host-valentin.webp",
  },
  artem: {
    name: "Артем",
    avatar: "/home/assets/host-artem.jpg",
  },
  kirill: {
    name: "Кирилл",
    avatar: "/home/assets/host-kirill.webp",
  },
  serafim: {
    name: "Серафим",
    avatar: "/home/assets/host-serafim.webp",
  },
} as const satisfies Record<string, Person>;

export function host(person: Person) {
  return {
    name: person.name,
    avatar: person.avatar,
    role: "Ведущий",
  };
}

export function guest(person: Person, guestNote: string) {
  return {
    name: person.name,
    avatar: person.avatar,
    role: "Гость",
    isGuest: true,
    guestNote,
  };
}

export const defaultHosts = [
  host(people.valentin),
  host(people.taras),
  host(people.murat),
];

export const defaultHostsDisplayOrder = [
  host(people.taras),
  host(people.murat),
  host(people.valentin),
];
