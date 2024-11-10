export enum Role {
    Patient = 1,
    Physician = 2,
    Admin = 3,
    Hospital = 4,
    Laboratory = 5,
    Pharmaceutical = 6,
    Nutraceutical = 7
  }

  export function getRoleId(roleName: string): number | undefined {
    const roleKey = roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();
    
    // Check if the roleKey exists in the Role enum
    if (Role[roleKey as keyof typeof Role] !== undefined) {
      return Role[roleKey as keyof typeof Role];
    }
    
    // Return undefined if the roleName doesn't match any Role
    return undefined;
  }
  