import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import TopicGlyph from '@components/guide/TopicGlyph';
import GuideDataActions from '@components/guide/GuideDataActions';
import { CompassMark } from '@components/your-compass/primitives';
import { GUIDE_TOPICS, type GuideTopic } from '@components/guide/topics';

// The guide: the welcome that lives on as help. The same GUIDE_TOPICS, now a
// calm browsable reference openable from anywhere, with a one-tap path back
// into the tour. Editorial column, soft accordion, gentle disclaimer.

const GuideItem: React.FC<{
  topic: GuideTopic;
  open: boolean;
  onToggle: () => void;
}> = ({ topic, open, onToggle }) => {
  const { t } = useTranslation();
  const body = t(`guide.topics.${topic.id}.body`, {
    returnObjects: true,
  }) as string[];

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-start gap-[18px] border-none bg-transparent px-1 py-[22px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <TopicGlyph icon={topic.icon} tone={topic.tone} size={48} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-3">
            <span className="font-display text-xl font-semibold leading-snug text-text">
              {t(`guide.topics.${topic.id}.title`)}
            </span>
            <ChevronDownIcon
              className="h-5 w-5 flex-none text-text-muted transition-transform duration-base ease-out-soft"
              style={{ transform: open ? 'rotate(180deg)' : 'none' }}
            />
          </span>
          {!open && (
            <span className="mt-1.5 block text-base leading-relaxed text-text-muted [text-wrap:pretty]">
              {t(`guide.topics.${topic.id}.lede`)}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="pr-1 pb-[26px] pl-[84px]">
          {body.map((p, idx) => (
            <p
              key={idx}
              className="text-lg leading-relaxed text-text-muted [text-wrap:pretty]"
              style={{ marginTop: idx === 0 ? 0 : 14 }}
            >
              {p}
            </p>
          ))}
          {topic.dataActions && <GuideDataActions />}
        </div>
      )}
    </div>
  );
};

const HelpGuide: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set([GUIDE_TOPICS[0].id]),
  );

  const toggle = (id: string) =>
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="bg-bg text-text px-4 pb-16">
      <div className="mx-auto w-full max-w-[720px] pt-11">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
          {t('guide.page.eyebrow')}
        </p>
        <h1 className="mt-2.5 font-display text-4xl font-semibold leading-tight tracking-[-0.015em] text-text [text-wrap:pretty]">
          {t('guide.page.title')}
        </h1>
        <p className="mt-4 max-w-[580px] text-xl leading-relaxed text-text-muted [text-wrap:pretty]">
          {t('guide.page.subtitle')}
        </p>

        <Card
          padding="md"
          className="my-7 flex flex-wrap items-center justify-between gap-4"
        >
          <span className="inline-flex min-w-0 items-center gap-3.5">
            <CompassMark size={30} />
            <span className="min-w-0">
              <span className="block text-base font-semibold text-text">
                {t('guide.page.replay_title')}
              </span>
              <span className="mt-0.5 block text-sm text-text-muted">
                {t('guide.page.replay_body')}
              </span>
            </span>
          </span>
          <Button variant="secondary" onClick={() => navigate('/welcome')}>
            {t('guide.page.replay_cta')}
          </Button>
        </Card>

        <div className="mt-4 border-t border-border">
          {GUIDE_TOPICS.map(topic => (
            <GuideItem
              key={topic.id}
              topic={topic}
              open={openIds.has(topic.id)}
              onToggle={() => toggle(topic.id)}
            />
          ))}
        </div>

        <p className="mt-10 text-sm leading-relaxed text-text-muted [text-wrap:pretty]">
          {t('guide.page.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default HelpGuide;
