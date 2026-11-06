/**
 * Import specifications: which fields an entity accepts, which are required and
 * how each column should be read. The Import Center builds its column mapping
 * UI from these declarations, so no column name is hardcoded.
 */

import type { EntityCollectionName } from '../domain/types';

export type FieldType = 'string' | 'number' | 'localized' | 'enum' | 'list' | 'boolean';

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  enumValues?: string[];
  /** Extra header names that map to this field automatically. */
  aliases?: string[];
  example: string;
}

export interface EntityImportSpec {
  collection: EntityCollectionName;
  label: string;
  description: string;
  fields: FieldSpec[];
}

const STATUS_MUSEUM = ['draft', 'review', 'published', 'archived'];
const STATUS_INSTITUTION = ['active', 'inactive'];
const TIMSS = ['knowing', 'applying', 'reasoning', 'integrated'];
const QUESTION_STATUS = ['idea', 'proposal', 'review', 'validated', 'published', 'archived'];

export const MUSEUM_IMPORT: EntityImportSpec = {
  collection: 'museums',
  label: 'Museums',
  description: 'Preserved submarines and their museums.',
  fields: [
    { key: 'id', label: 'ID', type: 'string', aliases: ['id', 'museum id'], example: 'MUS-SNK-161' },
    { key: 'name', label: 'Submarine name', type: 'localized', required: true, aliases: ['name', 'submarine', 'hull'], example: 'U-995' },
    { key: 'museumName', label: 'Museum name', type: 'localized', aliases: ['museum', 'museum name', 'location'], example: 'Laboe Naval Memorial' },
    { key: 'country', label: 'Country', type: 'string', aliases: ['country', 'pais'], example: 'Germany' },
    { key: 'city', label: 'City', type: 'string', aliases: ['city', 'city town', 'ciudad'], example: 'Laboe' },
    { key: 'vesselType', label: 'Vessel type', type: 'string', aliases: ['tipo', 'vessel type', 'class'], example: 'Type VIIC/41' },
    { key: 'propulsion', label: 'Propulsion', type: 'string', aliases: ['group', 'propulsion'], example: 'Diesel' },
    { key: 'origin', label: 'Origin', type: 'string', aliases: ['nationality', 'origin', 'origen'], example: 'Germany' },
    { key: 'launchYear', label: 'Launch year', type: 'number', aliases: ['launch year', 'lanzamiento', 'year'], example: '1943' },
    { key: 'latitude', label: 'Latitude', type: 'number', aliases: ['latitude', 'lat'], example: '54.4122016' },
    { key: 'longitude', label: 'Longitude', type: 'number', aliases: ['longitude', 'lon', 'lng'], example: '10.2307112' },
    { key: 'address', label: 'Address', type: 'string', aliases: ['address', 'address found', 'direccion'], example: 'Strandstraße 92, 24235 Laboe, Germany' },
    { key: 'website', label: 'Website', type: 'string', aliases: ['url', 'website', 'sitio'], example: 'https://example.org' },
    { key: 'mediaUrl', label: 'Video URL', type: 'string', aliases: ['video', 'media'], example: 'https://www.youtube.com/watch?v=...' },
    { key: 'description', label: 'Description', type: 'localized', aliases: ['description', 'descripcion'], example: 'Information to be validated.' },
    { key: 'status', label: 'Status', type: 'enum', enumValues: STATUS_MUSEUM, aliases: ['status', 'estado'], example: 'published' },
    { key: 'source', label: 'Source', type: 'string', aliases: ['source', 'fuente'], example: 'Reference dataset' },
    { key: 'notes', label: 'Notes', type: 'string', aliases: ['notes', 'observaciones', 'notas'], example: 'Imported row' },
  ],
};

export const INSTITUTION_IMPORT: EntityImportSpec = {
  collection: 'institutions',
  label: 'Institutions',
  description: 'Museums, associations, partners and schools.',
  fields: [
    { key: 'id', label: 'ID', type: 'string', aliases: ['id'], example: 'INS-002' },
    { key: 'name', label: 'Name', type: 'localized', required: true, aliases: ['name', 'nombre'], example: 'Laboe Naval Memorial' },
    { key: 'type', label: 'Type', type: 'enum', enumValues: ['museum', 'association', 'partner', 'school', 'other'], aliases: ['type', 'tipo'], example: 'museum' },
    { key: 'country', label: 'Country', type: 'string', aliases: ['country', 'pais'], example: 'Germany' },
    { key: 'city', label: 'City', type: 'string', aliases: ['city', 'ciudad'], example: 'Laboe' },
    { key: 'website', label: 'Website', type: 'string', aliases: ['website', 'url'], example: 'https://example.org' },
    { key: 'contactName', label: 'Contact name', type: 'string', aliases: ['contact name', 'contacto'], example: 'Jane Doe' },
    { key: 'contactEmail', label: 'Contact email', type: 'string', aliases: ['contact email', 'email', 'correo'], example: 'contact@example.org' },
    { key: 'status', label: 'Status', type: 'enum', enumValues: STATUS_INSTITUTION, aliases: ['status', 'estado'], example: 'active' },
    { key: 'notes', label: 'Notes', type: 'string', aliases: ['notes', 'observaciones'], example: '' },
  ],
};

export const QUESTION_IMPORT: EntityImportSpec = {
  collection: 'questions',
  label: 'Questions',
  description: 'TIMSS-style questions with four options and one correct answer.',
  fields: [
    { key: 'id', label: 'ID', type: 'string', aliases: ['id', 'id propuesto'], example: 'QST-IMPORT-001' },
    { key: 'text', label: 'Question text', type: 'localized', required: true, aliases: ['question', 'pregunta', 'text'], example: 'What is the main function of a periscope?' },
    { key: 'optionA', label: 'Option A', type: 'localized', required: true, aliases: ['option a', 'opcion a', 'a'], example: 'Measure the depth.' },
    { key: 'optionB', label: 'Option B', type: 'localized', required: true, aliases: ['option b', 'opcion b', 'b'], example: 'Observe from a protected position.' },
    { key: 'optionC', label: 'Option C', type: 'localized', required: true, aliases: ['option c', 'opcion c', 'c'], example: 'Generate electricity.' },
    { key: 'optionD', label: 'Option D', type: 'localized', required: true, aliases: ['option d', 'opcion d', 'd'], example: 'Filter the air.' },
    { key: 'correctOptionId', label: 'Correct answer', type: 'enum', required: true, enumValues: ['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd'], aliases: ['correct answer', 'respuesta correcta', 'answer'], example: 'B' },
    { key: 'missionId', label: 'Mission ID', type: 'string', aliases: ['mission id', 'mision'], example: 'MIS-STEEL-04' },
    { key: 'episodeId', label: 'Episode ID', type: 'string', aliases: ['episode id', 'episodio'], example: 'EPI-STEEL-04' },
    { key: 'museumId', label: 'Museum ID', type: 'string', aliases: ['museum id', 'museo'], example: 'MUS-U995' },
    { key: 'compartmentId', label: 'Compartment ID', type: 'string', aliases: ['compartment', 'compartimento'], example: 'CMP-U995-CONTROL' },
    { key: 'equipmentId', label: 'Equipment ID', type: 'string', aliases: ['equipment', 'equipo', 'system'], example: 'SYS-U995-PERISCOPE' },
    { key: 'area', label: 'Area', type: 'string', aliases: ['area', 'materia'], example: 'Science — Physics' },
    { key: 'timssDomain', label: 'TIMSS domain', type: 'enum', enumValues: TIMSS, aliases: ['timss domain', 'dominio timss', 'domain'], example: 'knowing' },
    { key: 'gsaCompetency', label: 'GSA competency', type: 'string', aliases: ['gsa', 'competency', 'competencia'], example: 'Critical thinking' },
    { key: 'topic', label: 'Topic', type: 'string', aliases: ['topic', 'tema'], example: 'Periscope' },
    { key: 'level', label: 'Level', type: 'string', aliases: ['level', 'nivel'], example: 'Copper (Grade 8)' },
    { key: 'feedback', label: 'Feedback', type: 'localized', aliases: ['feedback', 'retroalimentacion'], example: 'Correct. Light is reflected by mirrors or prisms.' },
    { key: 'civilSocietyConnection', label: 'Civil society connection', type: 'localized', aliases: ['civil society', 'sociedad civil'], example: 'Used in inspection cameras.' },
    { key: 'source', label: 'Source', type: 'string', aliases: ['source', 'fuente'], example: 'Reference dataset' },
    { key: 'status', label: 'Status', type: 'enum', enumValues: QUESTION_STATUS, aliases: ['status', 'estado'], example: 'review' },
    { key: 'notes', label: 'Notes', type: 'string', aliases: ['notes', 'observaciones'], example: '' },
  ],
};

export const IMPORT_SPECS: EntityImportSpec[] = [MUSEUM_IMPORT, INSTITUTION_IMPORT, QUESTION_IMPORT];

export function getImportSpec(collection: EntityCollectionName): EntityImportSpec | undefined {
  return IMPORT_SPECS.find((spec) => spec.collection === collection);
}
