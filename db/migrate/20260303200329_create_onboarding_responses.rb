class CreateOnboardingResponses < ActiveRecord::Migration[8.1]
  def change
    create_table :onboarding_responses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :question_key, null: false
      t.text :answer_text, null: false, default: ""
      t.boolean :is_other, default: false, null: false

      t.timestamps
    end

    add_index :onboarding_responses, [ :user_id, :question_key ], unique: true
  end
end
