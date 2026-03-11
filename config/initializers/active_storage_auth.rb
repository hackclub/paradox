# Require authentication for Active Storage direct uploads.
# Without this, the direct upload endpoint is publicly accessible because
# ActiveStorage::DirectUploadsController inherits from ActionController::Base,
# not ApplicationController, bypassing session-based auth.
Rails.application.config.after_initialize do
  ActiveStorage::DirectUploadsController.class_eval do
    before_action :require_authenticated_user!

    private

    def require_authenticated_user!
      head :unauthorized unless session[:user_id] && User.exists?(id: session[:user_id])
    end
  end
end
