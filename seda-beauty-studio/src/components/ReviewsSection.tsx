import React, { useMemo } from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ReviewsSection: React.FC = () => {
  const { t, language } = useLanguage();

  const reviews = useMemo(() => {
    return [
      {
        id: 'rev-1',
        author:
          language === 'hy'
            ? 'Անի Կարապետյան'
            : language === 'ru'
            ? 'Ани Карапетян'
            : 'Ani Karapetyan',
        rating: 5,
        serviceUsed:
          language === 'hy'
            ? 'Հոլիվուդյան Ալիքներ'
            : language === 'ru'
            ? 'Голливудские Волны'
            : 'Signature Cascading Hollywood Waves',
        date: language === 'hy' ? 'Երեկ' : language === 'ru' ? 'Вчера' : 'Yesterday',
        text:
          language === 'hy'
            ? 'Սեդայի մոտ վարսահարդարումս պարզապես հիանալի էր: Ամբողջ երեկո ալիքները մնացին անթերի: Շատ շնորհակալ եմ բարձր որակի համար:'
            : language === 'ru'
            ? 'Прическа у Седы превзошла все ожидания! Волны держались весь вечер безупречно. Спасибо за высочайший профессионализм.'
            : 'Seda did my hair for a wedding and it was pure perfection! The waves held flawlessly all night without feeling stiff.',
      },
      {
        id: 'rev-2',
        author:
          language === 'hy'
            ? 'Մարիամ Ղազարյան'
            : language === 'ru'
            ? 'Мариам Казарян'
            : 'Mariam Ghazaryan',
        rating: 5,
        serviceUsed:
          language === 'hy'
            ? 'Ապարատային Մատնահարդարում'
            : language === 'ru'
            ? 'Аппаратный Маникюр'
            : 'Russian Hardware Manicure',
        date: language === 'hy' ? '3 օր առաջ' : language === 'ru' ? '3 дня назад' : '3 days ago',
        text:
          language === 'hy'
            ? 'Արարատի մարզում լավագույն մատնահարդարումը: Կուտիկուլայի մշակումը իդեալական է, գույնը՝ խորը ու հարթ: Հիանալի ստերիլ միջավայր:'
            : language === 'ru'
            ? 'Лучший аппаратный маникюр в регионе! Обработка кутикулы идеальная, покрытие ровное и стойкое. Стерильность на высоте.'
            : 'Best manicure in Ararat Province. Cleanest cuticle work and flawless polish line. Absolutely sterile and gentle.',
      },
      {
        id: 'rev-3',
        author:
          language === 'hy'
            ? 'Էլեն Մկրտչյան'
            : language === 'ru'
            ? 'Элен Мкртчян'
            : 'Elen Mkrtchyan',
        rating: 5,
        serviceUsed:
          language === 'hy'
            ? 'Հարսանեկան Շինյոն'
            : language === 'ru'
            ? 'Свадебный Пучок'
            : 'Bridal Low Chignon',
        date: language === 'hy' ? 'Անցյալ շաբաթ' : language === 'ru' ? 'На прошлой неделе' : 'Last week',
        text:
          language === 'hy'
            ? 'Իմ հարսանեկան օրվա համար ընտրել էի Սեդային, և չսխալվեցի: Հավաքվածքը նրբագեղ էր և շատ ամուր: Բոլոր հյուրերը հիացած էին:'
            : language === 'ru'
            ? 'Для дня свадьбы выбрала студию Седы и была в полном восторге! Прическа была изысканной и надежной. Все гости восхищались.'
            : 'I chose Seda for my wedding day updo and it was the best decision! The chignon was elegant, lightweight, and stayed perfect.',
      },
    ];
  }, [language]);

  return (
    <section className="py-20 px-6 md:px-12 bg-[#FDFBF7] border-t border-b border-[#EAE0D5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1 text-[#D4A373] mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#D4A373] text-[#D4A373]" />
            ))}
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-[#1A1A1A]">
            {t.reviews.title}
          </h3>
          <p className="text-xs md:text-sm text-[#6C5549] mt-1">
            {t.reviews.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-[24px] border border-[#EAE0D5] shadow-[0_4px_24px_rgba(67,40,24,0.04)] flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-[#D4A373]/25 absolute top-5 right-5 pointer-events-none" />
              <div>
                <div className="flex items-center gap-1 text-[#D4A373] mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#432818]/90 leading-relaxed italic mb-4">
                  "{review.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#1A1A1A] flex items-center gap-1">
                    {review.author}
                    <CheckCircle className="w-3 h-3 text-[#D4A373]" />
                  </span>
                  <span className="text-[11px] text-[#6C5549] block">
                    {review.serviceUsed}
                  </span>
                </div>
                <span className="text-[10px] text-[#8C6D58]">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
