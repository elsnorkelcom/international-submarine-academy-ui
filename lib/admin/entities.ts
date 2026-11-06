/**
 * Admin panel schema.
 *
 * One declaration per entity drives the table, the form and the bulk actions,
 * so adding a collection never requires a new screen.
 */

import type { EntityCollectionName } from '../domain/types';

export type AdminFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'localized'
  | 'localizedTextarea'
  | 'list'
  | 'boolean'
  | 'date';

export interface AdminOption {
  value: string;
  label: string;
}

export interface AdminField {
  key: string;
  label: string;
  type: AdminFieldType;
  options?: AdminOption[];
  required?: boolean;
  hint?: string;
  /** Hidden from the form but kept when editing. */
  readonly?: boolean;
}

export interface AdminColumn {
  key: string;
  label: string;
  type?: 'text' | 'localized' | 'number' | 'status' | 'date' | 'boolean';
}

export interface AdminEntity {
  collection: EntityCollectionName;
  label: string;
  singular: string;
  description: string;
  columns: AdminColumn[];
  fields: AdminField[];
  /** Field used for publishing; enables publish/unpublish actions. */
  statusField?: string;
  publishedValue?: string;
  draftValue?: string;
  defaultSort?: string;
}

const PUBLISHED = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const TIMSS_OPTIONS: AdminOption[] = [
  { value: 'knowing', label: 'Knowing' },
  { value: 'applying', label: 'Applying' },
  { value: 'reasoning', label: 'Reasoning' },
  { value: 'integrated', label: 'Integrated' },
];

const LOCALIZED = (key: string, label: string, required = false): AdminField => ({
  key,
  label,
  type: 'localized',
  required,
});

export const ADMIN_ENTITIES: AdminEntity[] = [
  {
    collection: 'museums',
    label: 'Museums',
    singular: 'Museum',
    description: 'Preserved submarines and the museums that host them.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'name',
    columns: [
      { key: 'dossier', label: 'File' },
      { key: 'name', label: 'Submarine', type: 'localized' },
      { key: 'museumName', label: 'Museum', type: 'localized' },
      { key: 'country', label: 'Country' },
      { key: 'situation', label: 'Situation', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true, hint: 'Readable ID, e.g. MUS-U995.' },
      LOCALIZED('name', 'Submarine name', true),
      LOCALIZED('museumName', 'Museum name'),
      { key: 'country', label: 'Country', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'vesselType', label: 'Vessel type', type: 'text' },
      { key: 'propulsion', label: 'Propulsion', type: 'text' },
      { key: 'origin', label: 'Origin', type: 'text' },
      { key: 'launchYear', label: 'Launch year', type: 'number' },
      { key: 'latitude', label: 'Latitude', type: 'number' },
      { key: 'longitude', label: 'Longitude', type: 'number' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'website', label: 'Website', type: 'text' },
      { key: 'mediaUrl', label: 'Video URL', type: 'text' },
      { key: 'description', label: 'Description', type: 'localizedTextarea' },
      { key: 'dossier', label: 'Archive file', type: 'text', hint: 'e.g. SNK-012' },
      { key: 'situation', label: 'Situation', type: 'select', options: [
        { value: 'flote', label: 'Afloat' },
        { value: 'agua', label: 'In the water' },
        { value: 'tierra', label: 'On land' },
        { value: 'cerrado', label: 'Under cover' },
        { value: 'monumento', label: 'Monument only' },
      ] },
      { key: 'featured', label: 'Featured', type: 'boolean' },
      { key: 'validation', label: 'Validation', type: 'select', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'validated', label: 'Validated' },
      ] },
      { key: 'status', label: 'Status', type: 'select', options: PUBLISHED },
      { key: 'source', label: 'Source', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    collection: 'institutions',
    label: 'Institutions',
    singular: 'Institution',
    description: 'Museums, associations, partners and schools.',
    statusField: 'status',
    publishedValue: 'active',
    draftValue: 'inactive',
    defaultSort: 'name',
    columns: [
      { key: 'name', label: 'Name', type: 'localized' },
      { key: 'type', label: 'Type', type: 'status' },
      { key: 'city', label: 'City' },
      { key: 'country', label: 'Country' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      LOCALIZED('name', 'Name', true),
      { key: 'type', label: 'Type', type: 'select', options: [
        { value: 'museum', label: 'Museum' },
        { value: 'association', label: 'Association' },
        { value: 'partner', label: 'Partner' },
        { value: 'school', label: 'School' },
        { value: 'other', label: 'Other' },
      ] },
      { key: 'country', label: 'Country', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'website', label: 'Website', type: 'text' },
      { key: 'contactName', label: 'Contact name', type: 'text' },
      { key: 'contactEmail', label: 'Contact email', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ] },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    collection: 'accessKeys',
    label: 'Access keys',
    singular: 'Access key',
    description: 'Institutional keys. Only the hash is stored.',
    statusField: 'status',
    publishedValue: 'active',
    draftValue: 'suspended',
    defaultSort: 'label',
    columns: [
      { key: 'label', label: 'Label' },
      { key: 'institutionId', label: 'Institution' },
      { key: 'scope', label: 'Scope', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'institutionId', label: 'Institution ID', type: 'text' },
      { key: 'keyHash', label: 'Key hash (SHA-256)', type: 'text', hint: 'Generate it from the key console; never store the key itself.' },
      { key: 'scope', label: 'Scope', type: 'select', options: [
        { value: 'mvp', label: 'MVP' },
        { value: 'pilot', label: 'Pilot' },
        { value: 'demo', label: 'Demo' },
        { value: 'internal', label: 'Internal' },
      ] },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'revoked', label: 'Revoked' },
      ] },
      { key: 'validFrom', label: 'Valid from', type: 'date' },
      { key: 'validUntil', label: 'Valid until', type: 'date' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    collection: 'compartments',
    label: 'Compartments',
    singular: 'Compartment',
    description: 'Sections of the submarine.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'name',
    columns: [
      { key: 'name', label: 'Name', type: 'localized' },
      { key: 'museumId', label: 'Museum' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      LOCALIZED('name', 'Name', true),
      { key: 'museumId', label: 'Museum ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'localizedTextarea' },
      { key: 'systemIds', label: 'System IDs', type: 'list' },
      { key: 'status', label: 'Status', type: 'select', options: PUBLISHED },
    ],
  },
  {
    collection: 'systems',
    label: 'Systems',
    singular: 'System',
    description: 'Equipment and onboard systems.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'name',
    columns: [
      { key: 'name', label: 'Name', type: 'localized' },
      { key: 'category', label: 'Category' },
      { key: 'compartmentId', label: 'Compartment' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      LOCALIZED('name', 'Name', true),
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'description', label: 'Description', type: 'localizedTextarea' },
      { key: 'compartmentId', label: 'Compartment ID', type: 'text' },
      { key: 'museumId', label: 'Museum ID', type: 'text' },
      { key: 'topics', label: 'Topics', type: 'list' },
      { key: 'status', label: 'Status', type: 'select', options: PUBLISHED },
    ],
  },
  {
    collection: 'seasons',
    label: 'Seasons',
    singular: 'Season',
    description: 'Steel, Copper, Bronze, Silver and Gold.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'order',
    columns: [
      { key: 'title', label: 'Title', type: 'localized' },
      { key: 'name', label: 'Key' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'timssDomain', label: 'TIMSS', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      { key: 'name', label: 'Key', type: 'select', required: true, options: [
        { value: 'steel', label: 'Steel' },
        { value: 'copper', label: 'Copper' },
        { value: 'bronze', label: 'Bronze' },
        { value: 'silver', label: 'Silver' },
        { value: 'gold', label: 'Gold' },
      ] },
      LOCALIZED('title', 'Title', true),
      { key: 'description', label: 'Focus', type: 'localizedTextarea' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'colorTheme', label: 'Colour', type: 'text' },
      { key: 'timssDomain', label: 'TIMSS domain', type: 'select', options: TIMSS_OPTIONS },
      { key: 'gsaEmphasis', label: 'GSA emphasis', type: 'localized' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ] },
    ],
  },
  {
    collection: 'episodes',
    label: 'Episodes',
    singular: 'Episode',
    description: 'Series episodes, one museum and one system each.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'order',
    columns: [
      { key: 'title', label: 'Title', type: 'localized' },
      { key: 'seasonId', label: 'Season' },
      { key: 'museumId', label: 'Museum' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      LOCALIZED('title', 'Title', true),
      { key: 'seasonId', label: 'Season ID', type: 'text' },
      { key: 'museumId', label: 'Museum ID', type: 'text' },
      { key: 'compartmentId', label: 'Compartment ID', type: 'text' },
      { key: 'equipmentId', label: 'Equipment ID', type: 'text' },
      { key: 'mediaUrl', label: 'Video URL', type: 'text' },
      { key: 'durationSeconds', label: 'Duration (s)', type: 'number' },
      { key: 'description', label: 'Description', type: 'localizedTextarea' },
      { key: 'narrative', label: 'Narrative', type: 'localizedTextarea' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: PUBLISHED },
    ],
  },
  {
    collection: 'missions',
    label: 'Missions',
    singular: 'Mission',
    description: 'Learning missions attached to episodes.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'order',
    columns: [
      { key: 'title', label: 'Title', type: 'localized' },
      { key: 'episodeId', label: 'Episode' },
      { key: 'timssDomain', label: 'TIMSS', type: 'status' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      LOCALIZED('title', 'Title', true),
      { key: 'episodeId', label: 'Episode ID', type: 'text' },
      { key: 'seasonId', label: 'Season ID', type: 'text' },
      { key: 'museumId', label: 'Museum ID', type: 'text' },
      { key: 'compartmentId', label: 'Compartment ID', type: 'text' },
      { key: 'equipmentId', label: 'Equipment ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'localizedTextarea' },
      { key: 'learningObjective', label: 'Learning objective', type: 'localizedTextarea' },
      { key: 'timssDomain', label: 'TIMSS domain', type: 'select', options: TIMSS_OPTIONS },
      { key: 'gsaCompetency', label: 'GSA competency', type: 'text' },
      { key: 'civilSocietyConnection', label: 'Civil society connection', type: 'localizedTextarea' },
      { key: 'order', label: 'Order', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: PUBLISHED },
    ],
  },
  {
    collection: 'questions',
    label: 'Questions',
    singular: 'Question',
    description: 'TIMSS-style questions with four options.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'topic',
    columns: [
      { key: 'text', label: 'Question', type: 'localized' },
      { key: 'topic', label: 'Topic' },
      { key: 'timssDomain', label: 'TIMSS', type: 'status' },
      { key: 'correctOptionId', label: 'Answer' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      { key: 'text', label: 'Question text', type: 'localizedTextarea', required: true },
      { key: 'missionId', label: 'Mission ID', type: 'text' },
      { key: 'episodeId', label: 'Episode ID', type: 'text' },
      { key: 'museumId', label: 'Museum ID', type: 'text' },
      { key: 'compartmentId', label: 'Compartment ID', type: 'text' },
      { key: 'equipmentId', label: 'Equipment ID', type: 'text' },
      { key: 'area', label: 'Area', type: 'text' },
      { key: 'timssDomain', label: 'TIMSS domain', type: 'select', options: TIMSS_OPTIONS },
      { key: 'gsaCompetency', label: 'GSA competency', type: 'text' },
      { key: 'topic', label: 'Topic', type: 'text' },
      { key: 'level', label: 'Level', type: 'text' },
      { key: 'correctOptionId', label: 'Correct answer', type: 'select', options: [
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
      ] },
      { key: 'feedback', label: 'Feedback', type: 'localizedTextarea' },
      { key: 'civilSocietyConnection', label: 'Civil society connection', type: 'localizedTextarea' },
      { key: 'source', label: 'Source', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'idea', label: 'Idea' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'review', label: 'Review' },
        { value: 'validated', label: 'Validated' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ] },
    ],
  },
  {
    collection: 'badges',
    label: 'Badges',
    singular: 'Badge',
    description: 'Credentials, Coins and badges.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'name',
    columns: [
      { key: 'name', label: 'Name', type: 'localized' },
      { key: 'type', label: 'Type', type: 'status' },
      { key: 'seasonId', label: 'Season' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      LOCALIZED('name', 'Name', true),
      { key: 'type', label: 'Type', type: 'select', options: [
        { value: 'credential', label: 'Credential' },
        { value: 'coin', label: 'Coin' },
        { value: 'badge', label: 'Badge' },
      ] },
      { key: 'seasonId', label: 'Season ID', type: 'text' },
      { key: 'missionId', label: 'Mission ID', type: 'text' },
      { key: 'description', label: 'Description', type: 'localizedTextarea' },
      { key: 'icon', label: 'Icon', type: 'text' },
      { key: 'color', label: 'Colour', type: 'text' },
      { key: 'criteria', label: 'Criteria', type: 'localizedTextarea' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ] },
    ],
  },
  {
    collection: 'roles',
    label: 'Roles',
    singular: 'Role',
    description: 'Crew roles used by missions.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'name',
    columns: [
      { key: 'name', label: 'Name', type: 'localized' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      LOCALIZED('name', 'Name', true),
      { key: 'description', label: 'Description', type: 'localizedTextarea' },
      { key: 'equipmentIds', label: 'Equipment IDs', type: 'list' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ] },
    ],
  },
  {
    collection: 'disciplines',
    label: 'Disciplines',
    singular: 'Discipline',
    description: 'Curricular disciplines.',
    statusField: 'status',
    publishedValue: 'published',
    draftValue: 'draft',
    defaultSort: 'name',
    columns: [
      { key: 'name', label: 'Name', type: 'localized' },
      { key: 'color', label: 'Colour' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      LOCALIZED('name', 'Name', true),
      { key: 'description', label: 'Description', type: 'localizedTextarea' },
      { key: 'color', label: 'Colour', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ] },
    ],
  },
];

export function getAdminEntity(collection: string): AdminEntity | undefined {
  return ADMIN_ENTITIES.find((entity) => entity.collection === collection);
}
