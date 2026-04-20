# TOLK Image Policy

## Назначение
Этот файл фиксирует рабочие правила для изображений в MVP и при переносе в production, чтобы не копить layout shifts, случайные crop-расхождения и хаотичные naming-практики.

## Категории ассетов
- `pages/home/assets/episode-*.jpg` — thumbnail-обложки выпусков.
- `pages/home/assets/host-*.{jpg,png}` — аватары ведущих и гостей.
- `assets/merch.png` — изображение мерча.
- `assets/socials-*.svg` — иконки платформ.

## Правила разметки
- Для всех `img` задавать `width` и `height`, если это известные статические ассеты.
- Контейнер изображения должен заранее резервировать геометрию через `height` или `aspect-ratio`.
- Декоративные иконки внутри controls должны иметь пустой `alt=""`.
- Контентные превью и портреты должны иметь осмысленный `alt`.

## Object-Fit Policy
- Hero episode thumbnail: `object-fit: contain`, чтобы не терять важные части обложки.
- Episode cards: `object-fit: cover`, так как карточка допускает controlled crop.
- Host avatars: `object-fit: cover`.
- Merch image: `object-fit: cover`, пока это editorial promo block, а не catalog zoom view.

## Aspect Ratio Policy
- Episode thumbnails: ориентир `16:9`.
- Hero episode media: резервировать размер через `aspect-ratio: 16 / 9`.
- Avatar images: квадратный исходник или безопасный crop под круг.
- Merch promo: высокий вертикальный кадр допустим; ratio зависит от конкретного носителя.

## Naming Rules
- Выпуски: `episode-<slug>.jpg`
- Ведущие и гости: `host-<slug>.jpg|png`
- Социальные иконки: `socials-<platform>.svg`
- Не использовать абстрактные имена вроде `final2.png`, `new-cover.jpg`, `avatar-last.png`

## Optimization Rules
- В MVP допустим один исходный размер, если страница статическая.
- При переносе в production episode thumbnails и merch должны перейти на responsive image pipeline.
- В production preferred path: `next/image` или эквивалент с `srcset`/sizes.
- SVG иконки хранить как отдельные ассеты или как inline SVG, но не смешивать оба способа без причины.

## Запреты
- Не оставлять изображения без зарезервированной геометрии.
- Не менять `object-fit` локально в карточке без осознанной причины.
- Не добавлять случайные новые папки для ассетов страницы, если категория уже существует.
