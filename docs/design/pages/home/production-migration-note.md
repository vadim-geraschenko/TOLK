# Home Production Migration Note

## Цель
Этот файл нужен как короткая инженерная памятка перед переносом `home-mvp.html` в production-стек.

## Что уже приведено в порядок
- Токены, base, components и responsive-слои логически разделены.
- Основные “магические” размеры вынесены в CSS custom properties.
- `reading-card` использует единый layout-механизм через CSS variables, а не набор несвязанных локальных переопределений.
- Данные для hero episode, episode cards, participants и socials вынесены в `siteData`.
- Для ключевых изображений добавлены `width`/`height`.
- Основной тип кнопки унифицирован через `.button`, а `.mini-button` используется только как size-modifier.

## Что должно стать компонентами
- `HeroIntro`
- `HeroEpisodeCard`
- `ReadingCard`
- `ParticipantCard`
- `EpisodeCard`
- `MerchCard`
- `SocialButton`
- `SectionDivider`

## Что должно стать данными
- `siteData.episodes`
- `siteData.participants`
- `siteData.socials`

При переносе это должно жить не в inline script, а в typed data layer:
- `home.data.ts`
- или CMS/API mapping layer

## Что нельзя потерять при переносе
- Desktop layout считается текущим эталоном.
- `reading-card` переносится под `hero` только в заданных responsive-состояниях.
- На средних mobile-width `reading-card` остаётся двухколоночной.
- Episode cards не должны шире `320px` в домашней карусели.
- Участники в mobile-column не должны растягиваться без ограничения ширины.
- Hover-поведение кнопок должно переноситься как единый button-component, а не дублироваться локальными стилями по секциям.
- В текущем MVP кнопки используют 7 внутренних звёзд и отдельную mobile/tablet-раскладку при ширине меньше примерно `854px`.

## Recommended Production Steps
1. Вынести данные страницы в typed object/module.
2. Перенести каждый повторяющийся блок в отдельный компонент.
3. Разбить CSS на модульные файлы или CSS-in-JS слои без изменения токенов.
4. Подключить responsive image pipeline.
5. Зафиксировать visual regression screenshots на контрольных ширинах.

## Control Widths For Regression
- `1280px`
- `1100px`
- `979px`
- `760px`
- `561px`
- `520px`
- `390px`

## Migration Risks
- Случайный откат tablet-layout логики `reading-card`.
- Потеря max-width у episode cards.
- Потеря `width`/`height` и возврат layout shift.
- Несогласованность token names между MVP и production implementation.
- Локальное раздвоение кнопочной системы на несколько визуально разных CTA без явного решения в design docs.
