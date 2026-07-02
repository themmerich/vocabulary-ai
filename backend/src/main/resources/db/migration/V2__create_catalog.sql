-- Admin-curated vocabulary catalog: Lehrwerk -> Lektion -> Vokabel, plus
-- Grammatikregel on the Lektion. Order is captured by an explicit order_index
-- per parent; child rows cascade-delete with their parent.

create table lehrwerk (
    id         uuid         primary key,
    title      varchar(200) not null,
    language   varchar(100) not null,
    created_at timestamptz  not null default now()
);

create table lektion (
    id          uuid         primary key,
    lehrwerk_id uuid         not null references lehrwerk (id) on delete cascade,
    title       varchar(200) not null,
    order_index integer      not null,
    created_at  timestamptz  not null default now()
);

create index idx_lektion_lehrwerk on lektion (lehrwerk_id);

create table vokabel (
    id           uuid         primary key,
    lektion_id   uuid         not null references lektion (id) on delete cascade,
    foreign_term varchar(200) not null,
    order_index  integer      not null,
    created_at   timestamptz  not null default now()
);

create index idx_vokabel_lektion on vokabel (lektion_id);

create table vokabel_meaning (
    vokabel_id uuid         not null references vokabel (id) on delete cascade,
    position   integer      not null,
    meaning    varchar(200) not null,
    primary key (vokabel_id, position)
);

create table grammatikregel (
    id          uuid         primary key,
    lektion_id  uuid         not null references lektion (id) on delete cascade,
    title       varchar(200) not null,
    content     text         not null,
    order_index integer      not null,
    created_at  timestamptz  not null default now()
);

create index idx_grammatikregel_lektion on grammatikregel (lektion_id);
