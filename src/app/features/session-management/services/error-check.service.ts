import { EENSection } from './session.service';

export type ScheduleIssue = {
  type: 'Error' | 'Warning';
  message: string;
};

export function detectScheduleIssues(sections: EENSection[]): ScheduleIssue[] {
  const issues: ScheduleIssue[] = [];
  const slotMap = new Map<string, EENSection[]>();
  const courseCampusMap = new Map<string, Set<string>>();

  for (const section of sections) {
    const key = `${section.instructor}|${section.slotNumber}`;
    if (!slotMap.has(key)) slotMap.set(key, []);
    slotMap.get(key)!.push(section);

    if (!courseCampusMap.has(section.course))
      courseCampusMap.set(section.course, new Set());
    courseCampusMap.get(section.course)!.add(section.campus);
  }

  for (const [key, sessions] of slotMap.entries()) {
    if (sessions.length > 1) {
      const campuses = new Set(sessions.map(s => s.campus));
      const instructor = sessions[0].instructor;
      const slot = sessions[0].slotNumber;

      if (campuses.size > 1) {
        issues.push({
          type: 'Error',
          message: `${instructor} has a time conflict: assigned to both campuses during Slot ${slot}`
        });
      } else {
        issues.push({
          type: 'Error',
          message: `${instructor} has a time conflict: assigned to multiple sessions in the same campus during Slot ${slot}`
        });
      }
    }
  }

  for (const [course, campuses] of courseCampusMap.entries()) {
    if (campuses.size === 1) {
      const campus = Array.from(campuses)[0];
      issues.push({
        type: 'Warning',
        message: `Warning: ${course} is offered only in ${campus}. Consider adding it to the other campus.`
      });
    }
  }

  return issues;
}
