export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17";
  };
  public: {
    Tables: {
      anatomical_structures: {
        Row: {
          canonical_name: string;
          content_version: number;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          fipat_id: string | null;
          id: string;
          last_reviewed_at: string | null;
          last_reviewed_by: string | null;
          latin_name: string | null;
          metadata: Json;
          parent_id: string | null;
          slug: string;
          snomed_id: string | null;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          system_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          canonical_name: string;
          content_version?: number;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          fipat_id?: string | null;
          id: string;
          last_reviewed_at?: string | null;
          last_reviewed_by?: string | null;
          latin_name?: string | null;
          metadata?: Json;
          parent_id?: string | null;
          slug: string;
          snomed_id?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          system_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          canonical_name?: string;
          content_version?: number;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          fipat_id?: string | null;
          id?: string;
          last_reviewed_at?: string | null;
          last_reviewed_by?: string | null;
          latin_name?: string | null;
          metadata?: Json;
          parent_id?: string | null;
          slug?: string;
          snomed_id?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          system_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "anatomical_structures_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "anatomical_structures_last_reviewed_by_fkey";
            columns: ["last_reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "anatomical_structures_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "anatomical_structures_system_id_fkey";
            columns: ["system_id"];
            isOneToOne: false;
            referencedRelation: "systems";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "anatomical_structures_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_log: {
        Row: {
          action: string;
          actor_id: string | null;
          after_state: Json | null;
          before_state: Json | null;
          created_at: string;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["content_entity_type"];
          id: number;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          after_state?: Json | null;
          before_state?: Json | null;
          created_at?: string;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["content_entity_type"];
          id?: never;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          after_state?: Json | null;
          before_state?: Json | null;
          created_at?: string;
          entity_id?: string;
          entity_type?: Database["public"]["Enums"]["content_entity_type"];
          id?: never;
        };
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      content_reviews: {
        Row: {
          created_at: string;
          decision: Database["public"]["Enums"]["review_decision"];
          entity_id: string;
          entity_type: Database["public"]["Enums"]["content_entity_type"];
          id: string;
          notes: string | null;
          reviewed_at: string | null;
          reviewer_id: string;
        };
        Insert: {
          created_at?: string;
          decision?: Database["public"]["Enums"]["review_decision"];
          entity_id: string;
          entity_type: Database["public"]["Enums"]["content_entity_type"];
          id?: string;
          notes?: string | null;
          reviewed_at?: string | null;
          reviewer_id: string;
        };
        Update: {
          created_at?: string;
          decision?: Database["public"]["Enums"]["review_decision"];
          entity_id?: string;
          entity_type?: Database["public"]["Enums"]["content_entity_type"];
          id?: string;
          notes?: string | null;
          reviewed_at?: string | null;
          reviewer_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      content_versions: {
        Row: {
          created_at: string;
          created_by: string | null;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["content_entity_type"];
          id: string;
          snapshot: Json;
          version_number: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["content_entity_type"];
          id?: string;
          snapshot: Json;
          version_number: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          entity_id?: string;
          entity_type?: Database["public"]["Enums"]["content_entity_type"];
          id?: string;
          snapshot?: Json;
          version_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "content_versions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      disease_references: {
        Row: {
          disease_id: string;
          locator: string | null;
          reference_id: string;
          section_key: string;
        };
        Insert: {
          disease_id: string;
          locator?: string | null;
          reference_id: string;
          section_key: string;
        };
        Update: {
          disease_id?: string;
          locator?: string | null;
          reference_id?: string;
          section_key?: string;
        };
        Relationships: [
          {
            foreignKeyName: "disease_references_disease_id_fkey";
            columns: ["disease_id"];
            isOneToOne: false;
            referencedRelation: "diseases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "disease_references_reference_id_fkey";
            columns: ["reference_id"];
            isOneToOne: false;
            referencedRelation: "references";
            referencedColumns: ["id"];
          },
        ];
      };
      disease_stage_translations: {
        Row: {
          description: string;
          disease_stage_id: string;
          locale: Database["public"]["Enums"]["locale_code"];
          name: string;
        };
        Insert: {
          description?: string;
          disease_stage_id: string;
          locale: Database["public"]["Enums"]["locale_code"];
          name: string;
        };
        Update: {
          description?: string;
          disease_stage_id?: string;
          locale?: Database["public"]["Enums"]["locale_code"];
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "disease_stage_translations_disease_stage_id_fkey";
            columns: ["disease_stage_id"];
            isOneToOne: false;
            referencedRelation: "disease_stages";
            referencedColumns: ["id"];
          },
        ];
      };
      disease_stages: {
        Row: {
          created_at: string;
          disease_id: string;
          id: string;
          progress_max: number;
          progress_min: number;
          stage_order: number;
          updated_at: string;
          visual_config: Json;
        };
        Insert: {
          created_at?: string;
          disease_id: string;
          id: string;
          progress_max: number;
          progress_min: number;
          stage_order: number;
          updated_at?: string;
          visual_config?: Json;
        };
        Update: {
          created_at?: string;
          disease_id?: string;
          id?: string;
          progress_max?: number;
          progress_min?: number;
          stage_order?: number;
          updated_at?: string;
          visual_config?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "disease_stages_disease_id_fkey";
            columns: ["disease_id"];
            isOneToOne: false;
            referencedRelation: "diseases";
            referencedColumns: ["id"];
          },
        ];
      };
      disease_structures: {
        Row: {
          disease_id: string;
          is_primary: boolean;
          structure_id: string;
        };
        Insert: {
          disease_id: string;
          is_primary?: boolean;
          structure_id: string;
        };
        Update: {
          disease_id?: string;
          is_primary?: boolean;
          structure_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "disease_structures_disease_id_fkey";
            columns: ["disease_id"];
            isOneToOne: false;
            referencedRelation: "diseases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "disease_structures_structure_id_fkey";
            columns: ["structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
        ];
      };
      disease_translations: {
        Row: {
          clinical_notes: string | null;
          complications: string | null;
          disease_id: string;
          etiology: string;
          functional_effects: string;
          locale: Database["public"]["Enums"]["locale_code"];
          morphology: string;
          name: string;
          pathogenesis: string;
          summary: string;
        };
        Insert: {
          clinical_notes?: string | null;
          complications?: string | null;
          disease_id: string;
          etiology?: string;
          functional_effects?: string;
          locale: Database["public"]["Enums"]["locale_code"];
          morphology?: string;
          name: string;
          pathogenesis?: string;
          summary?: string;
        };
        Update: {
          clinical_notes?: string | null;
          complications?: string | null;
          disease_id?: string;
          etiology?: string;
          functional_effects?: string;
          locale?: Database["public"]["Enums"]["locale_code"];
          morphology?: string;
          name?: string;
          pathogenesis?: string;
          summary?: string;
        };
        Relationships: [
          {
            foreignKeyName: "disease_translations_disease_id_fkey";
            columns: ["disease_id"];
            isOneToOne: false;
            referencedRelation: "diseases";
            referencedColumns: ["id"];
          },
        ];
      };
      diseases: {
        Row: {
          canonical_name: string;
          content_version: number;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          icd_code: string | null;
          id: string;
          last_reviewed_at: string | null;
          last_reviewed_by: string | null;
          slug: string;
          snomed_id: string | null;
          status: Database["public"]["Enums"]["content_status"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          canonical_name: string;
          content_version?: number;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          icd_code?: string | null;
          id: string;
          last_reviewed_at?: string | null;
          last_reviewed_by?: string | null;
          slug: string;
          snomed_id?: string | null;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          canonical_name?: string;
          content_version?: number;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          icd_code?: string | null;
          id?: string;
          last_reviewed_at?: string | null;
          last_reviewed_by?: string | null;
          slug?: string;
          snomed_id?: string | null;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "diseases_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "diseases_last_reviewed_by_fkey";
            columns: ["last_reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "diseases_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_annotation_translations: {
        Row: {
          annotation_id: string;
          description: string;
          label: string;
          locale: Database["public"]["Enums"]["locale_code"];
        };
        Insert: {
          annotation_id: string;
          description?: string;
          label: string;
          locale: Database["public"]["Enums"]["locale_code"];
        };
        Update: {
          annotation_id?: string;
          description?: string;
          label?: string;
          locale?: Database["public"]["Enums"]["locale_code"];
        };
        Relationships: [
          {
            foreignKeyName: "imaging_annotation_translations_annotation_id_fkey";
            columns: ["annotation_id"];
            isOneToOne: false;
            referencedRelation: "imaging_annotations";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_annotations: {
        Row: {
          color: string;
          created_at: string;
          frame_index: number;
          geometry: Json;
          geometry_type: Database["public"]["Enums"]["annotation_geometry_type"];
          id: string;
          metadata: Json;
          series_id: string;
          structure_id: string;
          updated_at: string;
        };
        Insert: {
          color?: string;
          created_at?: string;
          frame_index: number;
          geometry: Json;
          geometry_type: Database["public"]["Enums"]["annotation_geometry_type"];
          id: string;
          metadata?: Json;
          series_id: string;
          structure_id: string;
          updated_at?: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          frame_index?: number;
          geometry?: Json;
          geometry_type?: Database["public"]["Enums"]["annotation_geometry_type"];
          id?: string;
          metadata?: Json;
          series_id?: string;
          structure_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_annotations_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "imaging_series";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "imaging_annotations_structure_id_fkey";
            columns: ["structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_disease_links: {
        Row: {
          disease_id: string;
          study_id: string;
        };
        Insert: {
          disease_id: string;
          study_id: string;
        };
        Update: {
          disease_id?: string;
          study_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_disease_links_disease_id_fkey";
            columns: ["disease_id"];
            isOneToOne: false;
            referencedRelation: "diseases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "imaging_disease_links_study_id_fkey";
            columns: ["study_id"];
            isOneToOne: false;
            referencedRelation: "imaging_studies";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_frames: {
        Row: {
          created_at: string;
          frame_index: number;
          generated_variant: string | null;
          height: number | null;
          id: string;
          metadata: Json;
          series_id: string;
          storage_bucket: string | null;
          storage_path: string | null;
          thumbnail_path: string | null;
          width: number | null;
        };
        Insert: {
          created_at?: string;
          frame_index: number;
          generated_variant?: string | null;
          height?: number | null;
          id: string;
          metadata?: Json;
          series_id: string;
          storage_bucket?: string | null;
          storage_path?: string | null;
          thumbnail_path?: string | null;
          width?: number | null;
        };
        Update: {
          created_at?: string;
          frame_index?: number;
          generated_variant?: string | null;
          height?: number | null;
          id?: string;
          metadata?: Json;
          series_id?: string;
          storage_bucket?: string | null;
          storage_path?: string | null;
          thumbnail_path?: string | null;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_frames_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "imaging_series";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_references: {
        Row: {
          locator: string | null;
          reference_id: string;
          study_id: string;
        };
        Insert: {
          locator?: string | null;
          reference_id: string;
          study_id: string;
        };
        Update: {
          locator?: string | null;
          reference_id?: string;
          study_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_references_reference_id_fkey";
            columns: ["reference_id"];
            isOneToOne: false;
            referencedRelation: "references";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "imaging_references_study_id_fkey";
            columns: ["study_id"];
            isOneToOne: false;
            referencedRelation: "imaging_studies";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_reviews: {
        Row: {
          created_at: string;
          decision: Database["public"]["Enums"]["review_decision"];
          id: string;
          notes: string | null;
          reviewed_at: string | null;
          reviewer_id: string;
          study_id: string;
        };
        Insert: {
          created_at?: string;
          decision?: Database["public"]["Enums"]["review_decision"];
          id?: string;
          notes?: string | null;
          reviewed_at?: string | null;
          reviewer_id: string;
          study_id: string;
        };
        Update: {
          created_at?: string;
          decision?: Database["public"]["Enums"]["review_decision"];
          id?: string;
          notes?: string | null;
          reviewed_at?: string | null;
          reviewer_id?: string;
          study_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "imaging_reviews_study_id_fkey";
            columns: ["study_id"];
            isOneToOne: false;
            referencedRelation: "imaging_studies";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_series: {
        Row: {
          created_at: string;
          id: string;
          metadata: Json;
          orientation: Database["public"]["Enums"]["imaging_orientation"];
          sequence_name: string | null;
          sort_order: number;
          study_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          metadata?: Json;
          orientation: Database["public"]["Enums"]["imaging_orientation"];
          sequence_name?: string | null;
          sort_order?: number;
          study_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          metadata?: Json;
          orientation?: Database["public"]["Enums"]["imaging_orientation"];
          sequence_name?: string | null;
          sort_order?: number;
          study_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_series_study_id_fkey";
            columns: ["study_id"];
            isOneToOne: false;
            referencedRelation: "imaging_studies";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_series_translations: {
        Row: {
          description: string;
          locale: Database["public"]["Enums"]["locale_code"];
          name: string;
          series_id: string;
        };
        Insert: {
          description?: string;
          locale: Database["public"]["Enums"]["locale_code"];
          name: string;
          series_id: string;
        };
        Update: {
          description?: string;
          locale?: Database["public"]["Enums"]["locale_code"];
          name?: string;
          series_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_series_translations_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "imaging_series";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_structure_links: {
        Row: {
          is_primary: boolean;
          structure_id: string;
          study_id: string;
        };
        Insert: {
          is_primary?: boolean;
          structure_id: string;
          study_id: string;
        };
        Update: {
          is_primary?: boolean;
          structure_id?: string;
          study_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_structure_links_structure_id_fkey";
            columns: ["structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "imaging_structure_links_study_id_fkey";
            columns: ["study_id"];
            isOneToOne: false;
            referencedRelation: "imaging_studies";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_studies: {
        Row: {
          attribution: string;
          body_region: string;
          classification: Database["public"]["Enums"]["imaging_classification"];
          content_version: number;
          created_at: string;
          created_by: string | null;
          de_identified: boolean;
          deleted_at: string | null;
          educational_use: boolean;
          id: string;
          last_reviewed_at: string | null;
          last_reviewed_by: string | null;
          license: string;
          metadata: Json;
          modality: Database["public"]["Enums"]["imaging_modality"];
          review_due_at: string | null;
          slug: string;
          source: string;
          status: Database["public"]["Enums"]["content_status"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          attribution: string;
          body_region: string;
          classification: Database["public"]["Enums"]["imaging_classification"];
          content_version?: number;
          created_at?: string;
          created_by?: string | null;
          de_identified?: boolean;
          deleted_at?: string | null;
          educational_use?: boolean;
          id: string;
          last_reviewed_at?: string | null;
          last_reviewed_by?: string | null;
          license: string;
          metadata?: Json;
          modality: Database["public"]["Enums"]["imaging_modality"];
          review_due_at?: string | null;
          slug: string;
          source: string;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          attribution?: string;
          body_region?: string;
          classification?: Database["public"]["Enums"]["imaging_classification"];
          content_version?: number;
          created_at?: string;
          created_by?: string | null;
          de_identified?: boolean;
          deleted_at?: string | null;
          educational_use?: boolean;
          id?: string;
          last_reviewed_at?: string | null;
          last_reviewed_by?: string | null;
          license?: string;
          metadata?: Json;
          modality?: Database["public"]["Enums"]["imaging_modality"];
          review_due_at?: string | null;
          slug?: string;
          source?: string;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_studies_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "imaging_studies_last_reviewed_by_fkey";
            columns: ["last_reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "imaging_studies_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_study_translations: {
        Row: {
          description: string;
          locale: Database["public"]["Enums"]["locale_code"];
          study_id: string;
          title: string;
        };
        Insert: {
          description?: string;
          locale: Database["public"]["Enums"]["locale_code"];
          study_id: string;
          title: string;
        };
        Update: {
          description?: string;
          locale?: Database["public"]["Enums"]["locale_code"];
          study_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_study_translations_study_id_fkey";
            columns: ["study_id"];
            isOneToOne: false;
            referencedRelation: "imaging_studies";
            referencedColumns: ["id"];
          },
        ];
      };
      imaging_versions: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          snapshot: Json;
          study_id: string;
          version_number: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          snapshot: Json;
          study_id: string;
          version_number: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          snapshot?: Json;
          study_id?: string;
          version_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "imaging_versions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "imaging_versions_study_id_fkey";
            columns: ["study_id"];
            isOneToOne: false;
            referencedRelation: "imaging_studies";
            referencedColumns: ["id"];
          },
        ];
      };
      mesh_mappings: {
        Row: {
          asset_id: string;
          created_at: string;
          id: string;
          mesh_name: string;
          metadata: Json;
          structure_id: string;
          updated_at: string;
        };
        Insert: {
          asset_id: string;
          created_at?: string;
          id?: string;
          mesh_name: string;
          metadata?: Json;
          structure_id: string;
          updated_at?: string;
        };
        Update: {
          asset_id?: string;
          created_at?: string;
          id?: string;
          mesh_name?: string;
          metadata?: Json;
          structure_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mesh_mappings_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "three_d_assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "mesh_mappings_structure_id_fkey";
            columns: ["structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
        ];
      };
      physiology_references: {
        Row: {
          locator: string | null;
          physiology_topic_id: string;
          reference_id: string;
          section_key: string;
        };
        Insert: {
          locator?: string | null;
          physiology_topic_id: string;
          reference_id: string;
          section_key: string;
        };
        Update: {
          locator?: string | null;
          physiology_topic_id?: string;
          reference_id?: string;
          section_key?: string;
        };
        Relationships: [
          {
            foreignKeyName: "physiology_references_physiology_topic_id_fkey";
            columns: ["physiology_topic_id"];
            isOneToOne: false;
            referencedRelation: "physiology_topics";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "physiology_references_reference_id_fkey";
            columns: ["reference_id"];
            isOneToOne: false;
            referencedRelation: "references";
            referencedColumns: ["id"];
          },
        ];
      };
      physiology_topics: {
        Row: {
          canonical_name: string;
          content_version: number;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          id: string;
          last_reviewed_at: string | null;
          last_reviewed_by: string | null;
          slug: string;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          updated_at: string;
          updated_by: string | null;
          visual_config: Json;
        };
        Insert: {
          canonical_name: string;
          content_version?: number;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          id: string;
          last_reviewed_at?: string | null;
          last_reviewed_by?: string | null;
          slug: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
          updated_by?: string | null;
          visual_config?: Json;
        };
        Update: {
          canonical_name?: string;
          content_version?: number;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          id?: string;
          last_reviewed_at?: string | null;
          last_reviewed_by?: string | null;
          slug?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
          updated_by?: string | null;
          visual_config?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "physiology_topics_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "physiology_topics_last_reviewed_by_fkey";
            columns: ["last_reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "physiology_topics_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      physiology_translations: {
        Row: {
          clinical_notes: string | null;
          locale: Database["public"]["Enums"]["locale_code"];
          mechanism: string;
          name: string;
          physiology_topic_id: string;
          summary: string;
        };
        Insert: {
          clinical_notes?: string | null;
          locale: Database["public"]["Enums"]["locale_code"];
          mechanism?: string;
          name: string;
          physiology_topic_id: string;
          summary?: string;
        };
        Update: {
          clinical_notes?: string | null;
          locale?: Database["public"]["Enums"]["locale_code"];
          mechanism?: string;
          name?: string;
          physiology_topic_id?: string;
          summary?: string;
        };
        Relationships: [
          {
            foreignKeyName: "physiology_translations_physiology_topic_id_fkey";
            columns: ["physiology_topic_id"];
            isOneToOne: false;
            referencedRelation: "physiology_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          status: Database["public"]["Enums"]["profile_status"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["profile_status"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["profile_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      references: {
        Row: {
          authors: string[];
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          doi: string | null;
          edition: string | null;
          id: string;
          pmid: string | null;
          publication: string | null;
          publication_year: number | null;
          publisher: string | null;
          reference_type: string;
          status: Database["public"]["Enums"]["content_status"];
          title: string;
          updated_at: string;
          updated_by: string | null;
          url: string | null;
        };
        Insert: {
          authors?: string[];
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          doi?: string | null;
          edition?: string | null;
          id: string;
          pmid?: string | null;
          publication?: string | null;
          publication_year?: number | null;
          publisher?: string | null;
          reference_type?: string;
          status?: Database["public"]["Enums"]["content_status"];
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          url?: string | null;
        };
        Update: {
          authors?: string[];
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          doi?: string | null;
          edition?: string | null;
          id?: string;
          pmid?: string | null;
          publication?: string | null;
          publication_year?: number | null;
          publisher?: string | null;
          reference_type?: string;
          status?: Database["public"]["Enums"]["content_status"];
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "references_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "references_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      structure_physiology: {
        Row: {
          physiology_topic_id: string;
          sort_order: number;
          structure_id: string;
        };
        Insert: {
          physiology_topic_id: string;
          sort_order?: number;
          structure_id: string;
        };
        Update: {
          physiology_topic_id?: string;
          sort_order?: number;
          structure_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "structure_physiology_physiology_topic_id_fkey";
            columns: ["physiology_topic_id"];
            isOneToOne: false;
            referencedRelation: "physiology_topics";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "structure_physiology_structure_id_fkey";
            columns: ["structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
        ];
      };
      structure_references: {
        Row: {
          locator: string | null;
          reference_id: string;
          section_key: string;
          structure_id: string;
        };
        Insert: {
          locator?: string | null;
          reference_id: string;
          section_key: string;
          structure_id: string;
        };
        Update: {
          locator?: string | null;
          reference_id?: string;
          section_key?: string;
          structure_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "structure_references_reference_id_fkey";
            columns: ["reference_id"];
            isOneToOne: false;
            referencedRelation: "references";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "structure_references_structure_id_fkey";
            columns: ["structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
        ];
      };
      structure_relations: {
        Row: {
          created_at: string;
          related_structure_id: string;
          relation_type: string;
          structure_id: string;
        };
        Insert: {
          created_at?: string;
          related_structure_id: string;
          relation_type?: string;
          structure_id: string;
        };
        Update: {
          created_at?: string;
          related_structure_id?: string;
          relation_type?: string;
          structure_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "structure_relations_related_structure_id_fkey";
            columns: ["related_structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "structure_relations_structure_id_fkey";
            columns: ["structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
        ];
      };
      structure_synonyms: {
        Row: {
          created_at: string;
          id: string;
          locale: Database["public"]["Enums"]["locale_code"];
          structure_id: string;
          synonym: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          locale: Database["public"]["Enums"]["locale_code"];
          structure_id: string;
          synonym: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          locale?: Database["public"]["Enums"]["locale_code"];
          structure_id?: string;
          synonym?: string;
        };
        Relationships: [
          {
            foreignKeyName: "structure_synonyms_structure_id_fkey";
            columns: ["structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
        ];
      };
      structure_translations: {
        Row: {
          anatomy: string;
          blood_supply: string | null;
          clinical_notes: string | null;
          description: string;
          innervation: string | null;
          locale: Database["public"]["Enums"]["locale_code"];
          location: string;
          name: string;
          physiology: string;
          structure_id: string;
        };
        Insert: {
          anatomy?: string;
          blood_supply?: string | null;
          clinical_notes?: string | null;
          description?: string;
          innervation?: string | null;
          locale: Database["public"]["Enums"]["locale_code"];
          location?: string;
          name: string;
          physiology?: string;
          structure_id: string;
        };
        Update: {
          anatomy?: string;
          blood_supply?: string | null;
          clinical_notes?: string | null;
          description?: string;
          innervation?: string | null;
          locale?: Database["public"]["Enums"]["locale_code"];
          location?: string;
          name?: string;
          physiology?: string;
          structure_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "structure_translations_structure_id_fkey";
            columns: ["structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
        ];
      };
      system_translations: {
        Row: {
          description: string;
          locale: Database["public"]["Enums"]["locale_code"];
          name: string;
          system_id: string;
        };
        Insert: {
          description?: string;
          locale: Database["public"]["Enums"]["locale_code"];
          name: string;
          system_id: string;
        };
        Update: {
          description?: string;
          locale?: Database["public"]["Enums"]["locale_code"];
          name?: string;
          system_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "system_translations_system_id_fkey";
            columns: ["system_id"];
            isOneToOne: false;
            referencedRelation: "systems";
            referencedColumns: ["id"];
          },
        ];
      };
      systems: {
        Row: {
          canonical_name: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          id: string;
          is_available: boolean;
          metadata: Json;
          slug: string;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          canonical_name: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          id: string;
          is_available?: boolean;
          metadata?: Json;
          slug: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          canonical_name?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          id?: string;
          is_available?: boolean;
          metadata?: Json;
          slug?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "systems_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "systems_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      three_d_asset_versions: {
        Row: {
          asset_id: string;
          checksum_sha256: string | null;
          created_at: string;
          draco_compressed: boolean;
          file_size: number | null;
          id: string;
          ktx2_textures: boolean;
          lod_level: string;
          meshopt_compressed: boolean;
          metadata: Json;
          storage_bucket: string | null;
          storage_path: string | null;
          version: string;
        };
        Insert: {
          asset_id: string;
          checksum_sha256?: string | null;
          created_at?: string;
          draco_compressed?: boolean;
          file_size?: number | null;
          id?: string;
          ktx2_textures?: boolean;
          lod_level?: string;
          meshopt_compressed?: boolean;
          metadata?: Json;
          storage_bucket?: string | null;
          storage_path?: string | null;
          version: string;
        };
        Update: {
          asset_id?: string;
          checksum_sha256?: string | null;
          created_at?: string;
          draco_compressed?: boolean;
          file_size?: number | null;
          id?: string;
          ktx2_textures?: boolean;
          lod_level?: string;
          meshopt_compressed?: boolean;
          metadata?: Json;
          storage_bucket?: string | null;
          storage_path?: string | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "three_d_asset_versions_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "three_d_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      three_d_assets: {
        Row: {
          asset_type: string;
          attribution: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          file_size: number | null;
          format: string;
          id: string;
          license: string;
          metadata: Json;
          name: string;
          root_structure_id: string | null;
          source_url: string | null;
          status: Database["public"]["Enums"]["content_status"];
          storage_bucket: string | null;
          storage_path: string | null;
          system_id: string;
          updated_at: string;
          updated_by: string | null;
          version: string;
        };
        Insert: {
          asset_type: string;
          attribution: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          file_size?: number | null;
          format: string;
          id?: string;
          license: string;
          metadata?: Json;
          name: string;
          root_structure_id?: string | null;
          source_url?: string | null;
          status?: Database["public"]["Enums"]["content_status"];
          storage_bucket?: string | null;
          storage_path?: string | null;
          system_id: string;
          updated_at?: string;
          updated_by?: string | null;
          version: string;
        };
        Update: {
          asset_type?: string;
          attribution?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          file_size?: number | null;
          format?: string;
          id?: string;
          license?: string;
          metadata?: Json;
          name?: string;
          root_structure_id?: string | null;
          source_url?: string | null;
          status?: Database["public"]["Enums"]["content_status"];
          storage_bucket?: string | null;
          storage_path?: string | null;
          system_id?: string;
          updated_at?: string;
          updated_by?: string | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "three_d_assets_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "three_d_assets_root_structure_id_fkey";
            columns: ["root_structure_id"];
            isOneToOne: false;
            referencedRelation: "anatomical_structures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "three_d_assets_system_id_fkey";
            columns: ["system_id"];
            isOneToOne: false;
            referencedRelation: "systems";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "three_d_assets_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      search_medical_content: {
        Args: { result_limit?: number; search_query: string };
        Returns: {
          href: string;
          id: string;
          name_ar: string;
          name_en: string;
          result_type: string;
          system_id: string;
        }[];
      };
    };
    Enums: {
      annotation_geometry_type: "point" | "rectangle" | "polygon";
      app_role: "viewer" | "editor" | "reviewer" | "admin";
      content_entity_type:
        "system" | "structure" | "disease" | "physiology_topic" | "reference" | "three_d_asset";
      content_status: "draft" | "in_review" | "approved" | "published" | "rejected" | "archived";
      imaging_classification: "anatomical" | "radiologic" | "illustrative" | "conceptual_pathology";
      imaging_modality: "CT" | "MRI" | "XRAY" | "HISTOLOGY" | "PATHOLOGY";
      imaging_orientation: "axial" | "coronal" | "sagittal" | "projection" | "microscopy";
      locale_code: "en" | "ar";
      profile_status: "pending" | "active" | "suspended";
      review_decision: "pending" | "approved" | "rejected" | "changes_requested";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      annotation_geometry_type: ["point", "rectangle", "polygon"],
      app_role: ["viewer", "editor", "reviewer", "admin"],
      content_entity_type: [
        "system",
        "structure",
        "disease",
        "physiology_topic",
        "reference",
        "three_d_asset",
      ],
      content_status: ["draft", "in_review", "approved", "published", "rejected", "archived"],
      imaging_classification: ["anatomical", "radiologic", "illustrative", "conceptual_pathology"],
      imaging_modality: ["CT", "MRI", "XRAY", "HISTOLOGY", "PATHOLOGY"],
      imaging_orientation: ["axial", "coronal", "sagittal", "projection", "microscopy"],
      locale_code: ["en", "ar"],
      profile_status: ["pending", "active", "suspended"],
      review_decision: ["pending", "approved", "rejected", "changes_requested"],
    },
  },
} as const;
