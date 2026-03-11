# frozen_string_literal: true

class OnboardingResponsePolicy < ApplicationPolicy
  def create?
    user.present?
  end

  def update?
    owner?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(user: user)
    end
  end
end
