class PathController < ApplicationController
  allow_trial_access only: %i[index] # Trial users can view their path
  skip_after_action :verify_authorized, only: %i[index] # No authorizable resource
  skip_after_action :verify_policy_scoped, only: %i[index] # No scoped collection

  def index
    render inertia: {
      user: {
        display_name: current_user.display_name,
        email: current_user.email,
        koi: current_user.koi,
        avatar: current_user.avatar
      },
      has_projects: current_user.projects.kept.exists?,
      journal_entry_count: current_user.journal_entries.kept.count
    }
  end
end
