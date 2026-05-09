"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { actorColumns } from "@/components/operations/column-definitions";
import { actorsService } from "@/lib/services/actors.service";

export default function ActorsPage() {
  return (
    <ContentListPage
      columns={actorColumns}
      createLabel="Create Actor"
      description="Monitor learner identities, guest sessions, and account status."
      loader={actorsService.getActors}
      searchPlaceholder="Search actors..."
      title="Actors"
    />
  );
}
