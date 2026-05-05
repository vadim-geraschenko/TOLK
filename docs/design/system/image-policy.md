# TOLK Image Policy

## Назначение
Этот файл фиксирует рабочие правила для изображений в MVP и при переносе в production, чтобы не копить layout shifts, случайные crop-расхождения и хаотичные naming-практики.

## Категории ассетов
- `public/home/assets/episode-*.webp` — локальные thumbnail-обложки ключевых выпусков.
- `public/home/assets/host-*.{jpg,webp}` — аватары ведущих и гостей.
- `public/about/assets/clouds.webp` — декоративные облака страницы About.
- `public/assets/merch.webp` — изображение мерча.
- `public/assets/socials-*.svg` — иконки платформ.

## Правила разметки
- Для всех `img` задавать `width` и `height`, если это известные статические ассеты.
- Контейнер изображения должен заранее резервировать геометрию через `height` или `aspect-ratio`.
- Декоративные иконки внутри controls должны иметь пустой `alt=""`.
- Контентные превью и портреты должны иметь осмысленный `alt`.

## Object-Fit Policy
- Hero episode thumbnail: `object-fit: contain`, чтобы не терять важные части обложки.
- Episode cards: `object-fit: cover`, так как карточка допускает controlled crop.
- Host avatars: `object-fit: cover`.
- Merch image: `object-fit: cover`; в текущем `home-mvp.html` важнее сохранить крупную вертикальную подачу изображения, чем каталоговую точность всего кадра.

## Aspect Ratio Policy
- Episode thumbnails: ориентир `16:9`.
- Hero episode media: резервировать размер через `aspect-ratio: 16 / 9`.
- Avatar images: квадратный исходник или безопасный crop под круг.
- Merch promo: высокий вертикальный кадр допустим; ratio зависит от конкретного носителя.

## Naming Rules
- Выпуски: `episode-<slug>.webp`
- Ведущие и гости: `host-<slug>.jpg|webp`
- Социальные иконки: `socials-<platform>.svg`
- Не использовать абстрактные имена вроде `final2.png`, `new-cover.jpg`, `avatar-last.png`

## Optimization Rules
- В MVP допустим один WebP-исходник, если страница статическая и картинка не используется как полноэкранный media asset.
- Не хранить одни и те же ассеты в нескольких публичных папках: весь `public` попадает в static export.
- При переносе в production episode thumbnails и merch должны перейти на responsive image pipeline.
- В production preferred path: `next/image` или эквивалент с `srcset`/sizes.
- SVG иконки хранить как отдельные ассеты или как inline SVG, но не смешивать оба способа без причины.

## Запреты
- Не оставлять изображения без зарезервированной геометрии.
- Не менять `object-fit` локально в карточке без осознанной причины.
- Не добавлять случайные новые папки для ассетов страницы, если категория уже существует.
