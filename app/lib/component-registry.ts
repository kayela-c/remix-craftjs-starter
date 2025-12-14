import { ReactElement, ReactNode } from 'react';

/**
 * Component registration definition
 */
export interface ComponentDef {
  name: string;
  props?: Record<string, unknown>;
  node: ReactElement;
  demo?: ReactNode;
}

/**
 * Category with registered components
 */
export interface ComponentCategory {
  name: string;
  items: ComponentDef[];
}

/**
 * Component Registry - Central registry for all draggable components
 * Components can self-register here to automatically appear in the sidebar
 */
class ComponentRegistry {
  private categories: Map<string, ComponentDef[]> = new Map();

  /**
   * Register a component under a category
   * @param category - The category name (e.g., 'Buttons', 'Cards')
   * @param component - The component definition
   */
  register(category: string, component: ComponentDef): void {
    const existing = this.categories.get(category) || [];
    existing.push(component);
    this.categories.set(category, existing);
  }

  /**
   * Register multiple components under a category at once
   * @param category - The category name
   * @param components - Array of component definitions
   */
  registerMany(category: string, components: ComponentDef[]): void {
    const existing = this.categories.get(category) || [];
    existing.push(...components);
    this.categories.set(category, existing);
  }

  /**
   * Get all registered components as an array of categories
   * This format is compatible with the SideMenu component
   */
  getAll(): ComponentCategory[] {
    const result: ComponentCategory[] = [];
    this.categories.forEach((items, name) => {
      result.push({ name, items });
    });
    return result;
  }

  /**
   * Get components for a specific category
   */
  getCategory(category: string): ComponentDef[] {
    return this.categories.get(category) || [];
  }

  /**
   * Check if a category exists
   */
  hasCategory(category: string): boolean {
    return this.categories.has(category);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clear(): void {
    this.categories.clear();
  }
}

// Singleton instance
export const componentRegistry = new ComponentRegistry();

/**
 * Helper function to capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
